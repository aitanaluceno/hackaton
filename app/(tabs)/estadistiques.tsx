import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import LockedScreen from '@/components/pantallabloqueig';
import { useFormStatus } from '@/context/estatformularicontext';

const screenWidth = Dimensions.get('window').width;
const RECURSOS_URL = "https://impactovitalcancer.com/recursos-y-experiencias/recursos-pacientes/gestion-emocional-y-psicologica/";

const CATEGORY_MAP = {
  'Fluència verbal': { color: '#4caf50', name: 'Fluència Verbal' },
  'Atenció': { color: '#2196f3', name: 'Atenció' },
  'Memòria': { color: '#ff9800', name: 'Memòria de Treball' }, 
  'Velocitat de processament': { color: '#9c27b0', name: 'Velocitat Processament' },
  'Funcions executives': { color: '#f44336', name: 'Funcions Executives' }, 
};

const QUESTIONS = [
  { id: 1, category: "Atenció" },
  { id: 2, category: "Velocitat de processament" },
  { id: 3, category: "Fluència verbal" },
  { id: 4, category: "Atenció" },
  { id: 5, category: "Memòria" },
  { id: 6, category: "Memòria" },
  { id: 7, category: "Fluència verbal" }, 
  { id: 8, category: "Velocitat de processament" },
];

const LEGEND_CONFIG = {
  legendFontColor: '#fff',
  legendFontSize: 14,
  legendFontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  legendFontWeight: 'normal', 
};

const RECOMANACIONS = {
  'Atenció': {
    title: "Focus i Mindfulness 🧘",
    tips: [
      "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona.",
      "Aquesta setmana és ideal per fer alguna manualitat (dibuix, puzle, cosir...). Posa molta atenció en allò que fas.",
      "Si tens una estona, llegeix un text curt i intenta comprendre’l detenidament."
    ]
  },
  'Memòria': { 
    title: "Estratègies i Recordatoris 🧠",
    tips: [
      "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona.",
      "Aquesta setmana és ideal per tornar a fer aquella recepta que has deixat de fer i et sortia tan bé...",
      "Prova d'aprendre algunes paraules d'un nou idioma!"
    ]
  },
  'Velocitat de processament': {
    title: "Agilitat Mental ⚡",
    tips: [
      "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona.",
      "Avui és el dia de les decisions ràpides: no pots tardar més de 15 segons en escollir la roba que t'has de posar.",
      "Dia d'anar al supermercat! Prova a trobar el més ràpid possible on són les galetes Maria."
    ]
  },
  'Fluència verbal': {
    title: "Paraules i Llenguatge 🗣️",
    tips: [
      "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona.",
      "Avui durant 5 minuts has d'anar dient els objectes que veus al teu voltant.",
      "Pensa durant uns minuts quantes fruites i verdures hi ha de color vermell."
    ]
  },
  'Funcions executives': {
    title: "Planificació i Presa de Decisions 🤔",
    tips: [
      "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona.",
      "Planifica les teves tres tasques més importants del dia amb l'horari exacte.",
      "Intenta fer un pressupost setmanal amb detall de totes les despeses."
    ]
  },
  'Sense Dèficit': {
    title: "Enhorabona! 🎉",
    tips: [
      "Les teves respostes indiquen que actualment no presentes problemes cognitius.",
      "És important mantenir un estil de vida saludable:",
      "• Fer esport i cuidar l'alimentació.",
      "• Aprendre coses noves i sociabilitzar.",
      "• Fer Mindfulness."
    ]
  }
};

const loadReports = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const dailyReportKeys = keys.filter(key => key.startsWith('@daily_report_'));
    const reportsJson = await AsyncStorage.multiGet(dailyReportKeys);
    
    const reports = reportsJson
      .map(([key, value]) => {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.error(`Error parsing report for key ${key}:`, e);
          return null;
        }
      })
      .filter(report => report !== null);

    return reports;
  } catch (e) {
    console.error("Error cargando todos los reportes:", e);
    return [];
  }
};

const calculateDistribution = (reports, startDate = null) => {
  const counts = {};
  let totalSies = 0;

  Object.keys(CATEGORY_MAP).forEach(key => counts[key] = 0);

  const filterDate = startDate ? new Date(startDate) : null;

  reports.forEach(report => {
    const reportDate = new Date(report.date);

    if (filterDate && reportDate < filterDate) {
      return;
    }

    QUESTIONS.forEach(q => {
      const answer = report.answers[q.id.toString()];
      
      if (answer === 'si') {
        counts[q.category] = (counts[q.category] || 0) + 1;
        totalSies++;
      }
    });
  });

  if (totalSies === 0) {
    return [];
  }

  const pieChartData = Object.keys(counts)
    .filter(category => counts[category] > 0)
    .map(category => {
      const percentage = Math.round((counts[category] / totalSies) * 100);
      return {
        name: CATEGORY_MAP[category].name,
        population: percentage,
        color: CATEGORY_MAP[category].color,
        ...LEGEND_CONFIG
      };
    });

  const currentTotal = pieChartData.reduce((sum, item) => sum + item.population, 0);
  if (currentTotal !== 100 && pieChartData.length > 0) {
      const largestSegment = pieChartData.reduce((prev, current) => (prev.population > current.population ? prev : current));
      largestSegment.population += (100 - currentTotal);
  }

  return pieChartData;
};


export default function TabTwoScreen() {
  const [filter, setFilter] = useState('1mes'); 
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isFormCompleted, reportUpdateTrigger } = useFormStatus();

  const fetchReports = async () => {
      setLoading(true);
      const reports = await loadReports();
      setAllReports(reports);
      setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [reportUpdateTrigger]);

  if (!isFormCompleted) {
    return <LockedScreen />;
  }

  let currentData = [];
  let startDate = null;
  
  if (loading) {
    currentData = [];
  } else if (allReports.length === 0) {
    currentData = [];
  } else {
    const now = new Date();
    
    if (filter === '1mes') {
      startDate = new Date(now.setDate(now.getDate() - 30));
      currentData = calculateDistribution(allReports, startDate);
    } else if (filter === '3mesos') {
      const now3m = new Date();
      startDate = new Date(now3m.setDate(now3m.getDate() - 90));
      currentData = calculateDistribution(allReports, startDate);
    }
  }


  const getRecommendationContent = (data) => {
    if (!data || data.length === 0) return RECOMANACIONS['Sense Dèficit'];
    
    const sortedData = [...data].sort((a, b) => b.population - a.population);
    const topIssueName = sortedData[0].name;

    const issueKey = Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key].name === topIssueName);

    return RECOMANACIONS[issueKey] || RECOMANACIONS['Sense Dèficit'];
  };

  const currentAdvice = getRecommendationContent(currentData);
  const isHealthy = currentAdvice.title.includes("Enhorabona");
  const boxStyle = isHealthy ? styles.adviceHealthy : styles.adviceAlert;

  const handleOpenLink = () => {
    Linking.openURL(RECURSOS_URL).catch(err => console.error("Error obrint l'enllaç:", err));
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Evolució Cognitiva</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterBtn, filter === '1mes' && styles.filterBtnActive]}
            onPress={() => setFilter('1mes')}
          >
            <Text style={[styles.filterText, filter === '1mes' && styles.filterTextActive]}>Últim Mes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filter === '3mesos' && styles.filterBtnActive]}
            onPress={() => setFilter('3mesos')}
          >
            <Text style={[styles.filterText, filter === '3mesos' && styles.filterTextActive]}>Últims 3 Mesos</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionDescription}>
          Distribució de les dificultats detectades. L'àrea més gran indica on hem d'incidir avui.
        </Text>

        <View style={styles.chartContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#ffd33d" style={{ height: 220 }} />
            ) : currentData.length > 0 ? (
                <PieChart
                data={currentData}
                width={screenWidth - 60}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute 
                />
            ) : (
                <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: '#aaa', fontSize: 16}}>
                        {allReports.length === 0 ? "Encara no hi ha dades registrades 📝" : "Sense incidències registrades ✅"}
                    </Text>
                </View>
            )}
        </View>

        <View style={[styles.adviceBox, boxStyle]}>
          <Text style={styles.adviceTitle}>
            {currentAdvice.title}
          </Text>
          
          <View style={styles.tipsContainer}>
            {currentAdvice.tips.map((tip, index) => (
              <Text key={index} style={styles.adviceText}>
                {isHealthy && index > 1 && !tip.startsWith('•') ? '' : (isHealthy ? '' : '• ')} 
                {tip}
              </Text>
            ))}
          </View>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenLink}>
             <Text style={styles.actionButtonText}>Altres Recursos 🌐</Text>
          </TouchableOpacity>

        </View>

        {currentData.length > 0 && (
            <>
                <Text style={styles.subTitle}>Detall per Àrees</Text>
                {currentData.map((item, index) => (
                <View key={index} style={styles.rowItem}>
                    <View style={styles.rowHeader}>
                    <Text style={styles.rowLabel}>{item.name}</Text>
                    <Text style={styles.rowValue}>{item.population}%</Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${item.population}%`, backgroundColor: item.color }]} />
                    </View>
                </View>
                ))}
            </>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#1e1e1e', // Este es el fondo principal, lo dejo oscuro
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    minHeight: 900, 
  },
  // La imagen de cabecera (headerImage) y su estilo ya no se usan, pero dejo el style.mainContainer
  // si el usuario quiere que el fondo sea '#444', tendría que cambiar mainContainer o contentContainer
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10, // Añadido para dar espacio superior ahora que no hay header
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold', 
    color: '#fff',
  },
  sectionDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterBtnActive: {
    backgroundColor: '#555',
  },
  filterText: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 12, 
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25292e', 
    borderRadius: 16,
    padding: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  adviceBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderLeftWidth: 5,
  },
  adviceAlert: {
    backgroundColor: '#3e2723', 
    borderLeftColor: '#ff5722', 
  },
  adviceHealthy: {
    backgroundColor: '#1b5e20', 
    borderLeftColor: '#4caf50', 
  },
  adviceTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tipsContainer: {
    marginBottom: 15, 
  },
  adviceText: {
    color: '#e0e0e0',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 8,
  },
  actionButton: {
    marginTop: 5,
    backgroundColor: 'rgba(255,255,255,0.15)', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginTop: 10,
  },
  rowItem: {
    marginBottom: 20,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },
  rowValue: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
});