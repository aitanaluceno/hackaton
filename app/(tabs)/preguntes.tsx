import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';

const QUESTIONS = [
  { id: 1, text: "He anat a un lloc de l’habitació i, quan hi he arribat, no he recordat què hi anava a fer", category: "Atenció" },
  { id: 2, text: "He trigat més del normal a fer una activitat que abans feia més ràpid", category: "Velocitat de processament" },
  { id: 3, text: "Volia dir una paraula i no m’ha sortit, o n’he dit una altra sense voler", category: "Fluència verbal" },
  { id: 4, text: "Quan estava parlant amb algú, he perdut el fil de la conversa", category: "Atenció" },
  { id: 5, text: "M’han preguntat per una cosa que m’havien dit fa poc i no me n’he recordat", category: "Memòria" },
  { id: 6, text: "He tingut problemes per recordar informació que ja sabia prèviament", category: "Memòria" },
  { id: 7, text: "He tingut problemes per prendre una decisió que abans no m’hauria costat", category: "Funcions executives" },
  { id: 8, text: "He tingut dificultats per planificar el meu dia", category: "Funcions executives" },
];

export default function AboutScreen() {
  const [answers, setAnswers] = useState({});
  const [diaryEntry, setDiaryEntry] = useState('');

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = () => {
    const totalAnswered = Object.keys(answers).length;
    if (totalAnswered < QUESTIONS.length) {
      Alert.alert("Falten respostes", "Si us plau, respon totes les preguntes.");
      return;
    }
    
    const detectedCategories = new Set();
    QUESTIONS.forEach(q => {
      if (answers[q.id] === 'si') detectedCategories.add(q.category);
    });

    const categoriesArray = Array.from(detectedCategories);
    let recomendacion = categoriesArray.length === 0 
      ? "Tot correcte! Recomanació: Manteniment." 
      : `Detectat: ${categoriesArray.join(', ')}.`;

    const dailyReport = { date: new Date(), answers, journal: diaryEntry };
    console.log("Report:", dailyReport);

    Alert.alert("Registre Desat", recomendacion);
  };

  const YesNoRow = ({ questionData, currentAnswer, onAnswer }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{questionData.id}. {questionData.text}</Text>
      
      <View style={styles.optionsContainer}>
        {/* Botón SÍ */}
        <TouchableOpacity
          style={[
            styles.optionButton, 
            currentAnswer === 'si' && styles.optionButtonSelected // Usa estilo amarillo genérico
          ]}
          onPress={() => onAnswer(questionData.id, 'si')}
        >
          <Text style={[
            styles.optionText, 
            currentAnswer === 'si' && styles.optionTextSelected
          ]}>Sí</Text>
        </TouchableOpacity>

        {/* Botón NO */}
        <TouchableOpacity
          style={[
            styles.optionButton, 
            currentAnswer === 'no' && styles.optionButtonSelected // Usa estilo amarillo genérico
          ]}
          onPress={() => onAnswer(questionData.id, 'no')}
        >
          <Text style={[
            styles.optionText, 
            currentAnswer === 'no' && styles.optionTextSelected
          ]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Check-in Diari 👋</Text>
          <Text style={styles.subHeader}>Respon honestament si t'ha passat això avui.</Text>

          {QUESTIONS.map((q) => (
            <YesNoRow 
              key={q.id}
              questionData={q}
              currentAnswer={answers[q.id]}
              onAnswer={handleAnswer}
            />
          ))}

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Notes addicionals 🍃</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escriu aquí..."
              placeholderTextColor="#777"
              multiline={true}
              numberOfLines={4}
              value={diaryEntry}
              onChangeText={setDiaryEntry}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Generar Informe</Text>
          </TouchableOpacity>
          <View style={{height: 50}} /> 
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e' },
  scrollContainer: { padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 5 },
  subHeader: { fontSize: 16, color: '#ccc', marginBottom: 25 },
  
  questionContainer: {
    marginBottom: 20,
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: { fontSize: 17, fontWeight: '600', color: '#fff', marginBottom: 15, lineHeight: 24 },
  
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#444', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },

  // --- CAMBIO: Un solo estilo seleccionado (Amarillo) ---
  optionButtonSelected: {
    backgroundColor: '#ffd33d', // Amarillo
    borderColor: '#ffd33d',
  },

  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Texto negro cuando se selecciona para contraste con amarillo
  optionTextSelected: {
    color: '#000', 
    fontWeight: '900', 
  },

  textArea: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    textAlignVertical: 'top', 
    borderWidth: 1,
    borderColor: '#555',
    minHeight: 100, 
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#ffd33d',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#ffd33d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});