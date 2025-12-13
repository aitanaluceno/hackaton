import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { Dimensions, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import LockedScreen from '@/components/pantallabloqueig';
import { useFormStatus } from '@/context/estatformularicontext';

const screenWidth = Dimensions.get('window').width;
const RECURSOS_URL = "https://impactovitalcancer.com/recursos-y-experiencias/recursos-pacientes/gestion-emocional-y-psicologica/";

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
  'Memòria de Treball': { 
    title: "Estratègies i Recordatoris 🧠",
    tips: [
      "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona.",
      "Aquesta setmana és ideal per tornar a fer aquella recepta que has deixat de fer i et sortia tan bé...",
      "Prova d'aprendre algunes paraules d'un nou idioma!"
    ]
  },
  'Velocitat Processament': {
    title: "Agilitat Mental ⚡",
    tips: [
      "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona.",
      "Avui és el dia de les decisions ràpides: no pots tardar més de 15 segons en escollir la roba que et posaràs.",
      "Dia d'anar al supermercat! Prova a trobar el més ràpid possible on són les galetes Maria."
    ]
  },
  'Fluència Verbal': {
    title: "Paraules i Llenguatge 🗣️",
    tips: [
      "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona.",
      "Avui durant 5 minuts has d'anar dient els objectes que veus al teu voltant.",
      "Pensa durant uns minuts quantes fruites i verdures hi ha de color vermell."
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

export default function TabTwoScreen() {
  const [filter, setFilter] = useState('1mes'); 
  
  // 3. Obté l'estat del formulari
  const { isFormCompleted } = useFormStatus();

  // Condicional de bloqueig
  if (!isFormCompleted) {
    return <LockedScreen />;
  }

  // 1. DADES ÚLTIM MES
  // ... (la resta del teu codi continua igual)
  const dadesUltimMes = [
    { name: 'Fluència Verbal', population: 45, color: '#4caf50', ...LEGEND_CONFIG },
    { name: 'Atenció', population: 20, color: '#2196f3', ...LEGEND_CONFIG },
    { name: 'Memòria de Treball', population: 15, color: '#ff9800', ...LEGEND_CONFIG },
    { name: 'Velocitat Processament', population: 20, color: '#9c27b0', ...LEGEND_CONFIG },
  ];

  // 2. DADES ÚLTIMS 3 MESOS
  const dadesTrimestre = [
    { name: 'Fluència Verbal', population: 20, color: '#4caf50', ...LEGEND_CONFIG },
    { name: 'Atenció', population: 40, color: '#2196f3', ...LEGEND_CONFIG },
    { name: 'Memòria de Treball', population: 20, color: '#ff9800', ...LEGEND_CONFIG },
    { name: 'Velocitat Processament', population: 20, color: '#9c27b0', ...LEGEND_CONFIG },
  ];

  // 3. DADES SENSE DÈFICIT
  const dadesHealthy = []; 

  // SELECCIÓ DE DADES SEGONS FILTRE
  let currentData = [];
  if (filter === '1mes') currentData = dadesUltimMes;
  else if (filter === '3mesos') currentData = dadesTrimestre;
  else currentData = dadesHealthy;

  // LÒGICA DE RECOMANACIÓ
  const getRecommendationContent = (data) => {
    if (!data || data.length === 0) return RECOMANACIONS['Sense Dèficit'];
    const sortedData = [...data].sort((a, b) => b.population - a.population);
    const topIssue = sortedData[0];
    return RECOMANACIONS[topIssue.name] || RECOMANACIONS['Sense Dèficit'];
  };

  const currentAdvice = getRecommendationContent(currentData);
  const isHealthy = currentAdvice.title.includes("Enhorabona");
  const boxStyle = isHealthy ? styles.adviceHealthy : styles.adviceAlert;

  const handleOpenLink = () => {
    Linking.openURL(RECURSOS_URL).catch(err => console.error("Error obrint l'enllaç:", err));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#1e1e1e' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#ffd33d"
          name="chart.pie.fill"
          style={styles.headerImage}
        />
      }>
      
      <View style={styles.mainContainer}>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Evolució Cognitiva</Text>
        </View>

        {/* FILTRES TEMPORALS MODIFICATS */}
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
          <TouchableOpacity 
            style={[styles.filterBtn, filter === 'healthy' && styles.filterBtnActive]}
            onPress={() => setFilter('healthy')}
          >
            <Text style={[styles.filterText, filter === 'healthy' && styles.filterTextActive]}>No Dèficit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionDescription}>
          Distribució de les dificultats detectades. L'àrea més gran indica on hem d'incidir avui.
        </Text>

        {/* GRÀFIC */}
        {currentData.length > 0 ? (
          <View style={styles.chartContainer}>
            <PieChart
              data={currentData}
              width={screenWidth - 20}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute 
            />
          </View>
        ) : (
          <View style={[styles.chartContainer, { height: 100, justifyContent: 'center' }]}>
            <Text style={{color: '#aaa'}}>Sense incidències registrades ✅</Text>
          </View>
        )}

        {/* --- CAIXA DE RECOMANACIONS DINÀMICA --- */}
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

        {/* DETALL PER ÀREES */}
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
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#1e1e1e',
    flex: 1,
    padding: 20,
    minHeight: 900, 
  },
  headerImage: {
    color: '#ffd33d',
    bottom: -50,
    left: -30,
    position: 'absolute',
    opacity: 0.3
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 14,      // Font Size 14
    fontWeight: 'normal', // Normal (No negreta)
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