import LockedScreen from '@/components/pantallabloqueig';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFormStatus } from '@/context/estatformularicontext';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;



export default function TabTwoScreen() {
  // 1. Hooks de estado
  const { isFormCompleted } = useFormStatus();
  const [filter, setFilter] = useState('setmana');

  // 2. Lógica de Bloqueo: Si no ha rellenado el formulario, mostramos la pantalla de bloqueo
  if (!isFormCompleted) {
    return <LockedScreen />;
  }

  // 3. Lógica de Estadísticas (Solo se ejecuta si el formulario está completo)
  
  // Configuració de la font
  const fontConfig = {
    legendFontColor: '#e0e0e0',
    legendFontSize: 13,
    legendFontFamily: 'System',
    legendFontWeight: '600',
  };

  // DADES SETMANA ACTUAL
  const dadesSetmana = [
    { name: 'Memòria de treball', population: 35, color: '#4caf50', ...fontConfig },      // Verd
    { name: 'Velocitat processament', population: 25, color: '#ff9800', ...fontConfig },  // Taronja
    { name: 'Atenció', population: 20, color: '#2196f3', ...fontConfig },                 // Blau
    { name: 'Fluència alternant', population: 20, color: '#9c27b0', ...fontConfig },      // Lila
  ];

  // DADES MES ANTERIOR
  const dadesMes = [
    { name: 'Memòria de treball', population: 25, color: '#4caf50', ...fontConfig },
    { name: 'Velocitat processament', population: 25, color: '#ff9800', ...fontConfig },
    { name: 'Atenció', population: 35, color: '#2196f3', ...fontConfig },
    { name: 'Fluència alternant', population: 15, color: '#9c27b0', ...fontConfig },
  ];

  const currentData = filter === 'setmana' ? dadesSetmana : dadesMes;
  const needsIntervention = filter === 'setmana'; 

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
      
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Evolució Cognitiva</Text>
      </View>

      {/* FILTRES TEMPORALS */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'setmana' && styles.filterBtnActive]}
          onPress={() => setFilter('setmana')}
        >
          <Text style={[styles.filterText, filter === 'setmana' && styles.filterTextActive]}>Última Setmana</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'mes' && styles.filterBtnActive]}
          onPress={() => setFilter('mes')}
        >
          <Text style={[styles.filterText, filter === 'mes' && styles.filterTextActive]}>Últim Mes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionDescription}>
        Distribució del rendiment per àrees clíniques.
      </Text>

      {/* GRÀFIC DE QUESITOS (PIE CHART) */}
      <View style={styles.chartContainer}>
        <PieChart
          data={currentData}
          width={screenWidth} 
          height={240}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            decimalPlaces: 0,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 0]}
          absolute
          hasLegend={true}
        />
      </View>

      {/* EL "DOCTOR VIRTUAL" */}
      <View style={[styles.adviceBox, needsIntervention ? styles.adviceWarning : styles.adviceGood]}>
        <Text style={styles.adviceTitle}>
          {needsIntervention ? "⚠️ Detectem Estancament" : "✅ Progrés Adequat"}
        </Text>
        <Text style={styles.adviceText}>
          {needsIntervention 
            ? "Hem notat una baixada en l'Atenció i un estancament en la Velocitat processament. L'algoritme suggereix reduir la càrrega de 'Memòria de treball' i introduir exercicis de 'Fluència alternant' per recuperar agilitat."
            : "Els teus resultats mostren una millora constant. Continuarem amb el pla establert."}
        </Text>
        {needsIntervention && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🔄 Ajustar Pla Terapèutic</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* DETALL PER ÀREES */}
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

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: 'System', 
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
  adviceWarning: {
    backgroundColor: '#3e2723', 
    borderLeftColor: '#ff5722', 
  },
  adviceGood: {
    backgroundColor: '#1b5e20', 
    borderLeftColor: '#4caf50', 
  },
  adviceTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adviceText: {
    color: '#e0e0e0',
    lineHeight: 22,
  },
  actionButton: {
    marginTop: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  rowItem: {
    marginBottom: 15,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rowLabel: {
    color: '#fff',
    fontSize: 16,
  },
  rowValue: {
    color: '#aaa',
    fontSize: 16,
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