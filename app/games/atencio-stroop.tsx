import { IconSymbol } from '@/components/ui/icon-symbol';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

const COLORS = [
  { label: 'VERMELL', hex: '#ff4444' },
  { label: 'BLAU', hex: '#2196f3' },
  { label: 'VERD', hex: '#4caf50' },
  { label: 'GROC', hex: '#ffd33d' },
  { label: 'LILA', hex: '#9c27b0' },
  { label: 'TARONJA', hex: '#ff9800' }
];

export default function StroopGameScreen() {
  const router = useRouter();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  
  const [currentWord, setCurrentWord] = useState(COLORS[0]); 
  const [currentColor, setCurrentColor] = useState(COLORS[1]); 
  const [questionType, setQuestionType] = useState<'text' | 'color'>('text'); 
  const [options, setOptions] = useState<string[]>([]); 

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame();
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const generateRound = () => {
    const randomWordIdx = Math.floor(Math.random() * COLORS.length);
    const randomColorIdx = Math.floor(Math.random() * COLORS.length);
    
    const type = Math.random() > 0.5 ? 'text' : 'color';

    const wordObj = COLORS[randomWordIdx];
    const colorObj = COLORS[randomColorIdx];

    const correctAnswer = type === 'text' ? wordObj.label : colorObj.label;

    let wrongAnswerIdx = Math.floor(Math.random() * COLORS.length);
    while (COLORS[wrongAnswerIdx].label === correctAnswer) {
      wrongAnswerIdx = Math.floor(Math.random() * COLORS.length);
    }
    const wrongAnswer = COLORS[wrongAnswerIdx].label;

    const newOptions = Math.random() > 0.5 
      ? [correctAnswer, wrongAnswer] 
      : [wrongAnswer, correctAnswer];

    setCurrentWord(wordObj);
    setCurrentColor(colorObj);
    setQuestionType(type);
    setOptions(newOptions);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setGameState('playing');
    generateRound();
  };

  const handleAnswer = (selectedOption: string) => {
    const correctAnswer = questionType === 'text' ? currentWord.label : currentColor.label;

    if (selectedOption === correctAnswer) {
      setScore(prev => prev + 1);
      Vibration.vibrate(15); 
    } else {
      Vibration.vibrate(100); 
    }
    generateRound();
  };

  const finishGame = () => {
    setGameState('finished');
    Vibration.vibrate([0, 500]);
  };

  if (gameState === 'intro') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Atenció: Stroop', headerTintColor: '#ffd33d', headerStyle: { backgroundColor: '#1e1e1e' } }} />
        
        <IconSymbol name="eye.fill" size={80} color="#2196f3" style={{marginBottom: 20}} />
        
        <Text style={styles.title}>Colors Mentiders</Text>
        <Text style={styles.description}>
          Apareixerà una paraula pintada d'un color.
          {'\n\n'}
          De vegades et preguntarem: {'\n'}
          <Text style={{fontWeight:'bold', color: '#fff'}}> "Què hi posa?" (Llegeix)</Text>
          {'\n'}o{'\n'}
          <Text style={{fontWeight:'bold', color: '#fff'}}> "Quin color és?" (Mira)</Text>
          {'\n\n'}
          Respon ràpid abans que s'acabi el temps!
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
          <Text style={styles.buttonText}>COMENÇAR JOC</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameState === 'playing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.containerPlaying}>
          
          {/* Informació */}
          <View style={styles.headerBar}>
            <View>
              <Text style={styles.labelSmall}>Punts</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
            <View>
              <Text style={styles.labelSmall}>Temps</Text>
              <Text style={[styles.timerValue, timeLeft <= 10 && styles.textRed]}>{timeLeft}s</Text>
            </View>
          </View>

          {/* PREGUNTA */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionLabel}>
              {questionType === 'text' ? "QUÈ HI POSA?" : "QUIN COLOR ÉS?"}
            </Text>
            {questionType === 'text' ? (
                <IconSymbol name="text.quote" size={30} color="#ccc" />
            ) : (
                <IconSymbol name="paintpalette.fill" size={30} color="#ccc" />
            )}
          </View>

          {/* PARAULA STROOP */}
          <View style={styles.wordContainer}>
            <Text style={[styles.stroopWord, { color: currentColor.hex }]}>
              {currentWord.label}
            </Text>
          </View>

          {/* BOTONS DE RESPOSTA */}
          <View style={styles.optionsContainer}>
            {options.map((opt, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.optionButton} 
                onPress={() => handleAnswer(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>TEMPS ESGOTAT!</Text>
      
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Encerts totals:</Text>
        <Text style={styles.resultNumber}>{score}</Text>
      </View>

      <Text style={styles.description}>
        Exercici d'atenció selectiva completat.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>FINALITZAR I SORTIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  containerPlaying: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#ffd33d',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 15,
  },
  labelSmall: {
    color: '#888',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  scoreValue: {
    color: '#ffd33d',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textRed: {
    color: '#ff4444',
  },
  questionContainer: {
    alignItems: 'center',
    gap: 10,
  },
  questionLabel: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stroopWord: {
    fontSize: 55, 
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  optionsContainer: {
    flexDirection: 'row',
    gap: 15,
    height: 100,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
  },
  optionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  resultBox: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  resultLabel: {
    color: '#aaa',
    fontSize: 18,
  },
  resultNumber: {
    color: '#2196f3', 
    fontSize: 80,
    fontWeight: 'bold',
  },
});