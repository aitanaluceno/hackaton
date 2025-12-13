import { IconSymbol } from '@/components/ui/icon-symbol';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

const CATEGORIES = [
  "Coses que caben en una maleta",
  "Fruites o verdures vermelles",
  "Coses que trobes en un bany",
  "Animals que viuen a l'aigua",
  "Paraules que comencen per 'M'",
  "Roba d'hivern",
  "Instruments musicals",
  "Coses rodones",
  "Països d'Europa",
  "Marques de cotxes"
];

export default function FluenciaVerbalScreen() {
  const router = useRouter();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [category, setCategory] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

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

  const startGame = () => {
    const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setCategory(randomCat);
    setTimeLeft(30);
    setScore(0);
    setGameState('playing');
  };

  const incrementScore = () => {
    setScore(prev => prev + 1);
    Vibration.vibrate(50); 
  };

  const finishGame = () => {
    setGameState('finished');
    Vibration.vibrate([0, 500]); 
  };

  if (gameState === 'intro') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Fluència Verbal', headerBackTitle: 'Enrere', headerTintColor: '#ffd33d', headerStyle: { backgroundColor: '#1e1e1e' } }} />
        
        <IconSymbol name="brain.head.profile" size={80} color="#ffd33d" style={{marginBottom: 20}} />
        
        <Text style={styles.title}>Estàs a punt?</Text>
        <Text style={styles.description}>
          Et donarem una categoria i tindràs 30 segons per dir tantes paraules com puguis.
          {'\n\n'}
          Prem el botó <Text style={{fontWeight:'bold'}}>"+1 Paraula"</Text> cada vegada que en diguis una!
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
        <View style={styles.containerPlaying}>
          <Stack.Screen options={{ headerShown: false }} /> 
          
          {/* Temporizador: Ahora es parte del flujo, no absoluto */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Temps:</Text>
            <Text style={[styles.timerValue, timeLeft <= 5 && styles.timerRed]}>{timeLeft}s</Text>
          </View>

          <View style={styles.gameContent}>
            <Text style={styles.categoryLabel}>CATEGORIA:</Text>
            <View style={styles.card}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Paraules:</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>

            <TouchableOpacity style={styles.tapButton} onPress={incrementScore}>
              <Text style={styles.tapButtonText}>+1 PARAULA</Text>
              <Text style={styles.tapButtonSubtext}>(Prem cada cop que en diguis una)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Text style={styles.title}>TEMPS ESGOTAT! ⏰</Text>
      
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Has aconseguit:</Text>
        <Text style={styles.resultNumber}>{score}</Text>
        <Text style={styles.resultLabel}>Paraules</Text>
      </View>

      <Text style={styles.description}>
        Categoria: {category}
        {'\n\n'}
        <Text style={{fontWeight: 'bold', color: '#ffd33d'}}>Resultat registrat correctament.</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  gameContent: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center', 
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
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  timerContainer: {
    alignItems: 'center',
    marginBottom: 20, 
    marginTop: 20,
  },
  timerLabel: {
    color: '#aaa',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  timerValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
  },
  timerRed: {
    color: '#ff4444', 
  },

  categoryLabel: {
    color: '#ffd33d',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  
  card: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  categoryText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
    gap: 10,
  },
  scoreLabel: {
    color: '#ccc',
    fontSize: 20,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },

  // Botón Grande
  tapButton: {
    backgroundColor: '#4caf50', 
    width: 220, 
    height: 220,
    borderRadius: 110, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderWidth: 4,
    borderColor: '#81c784',
  },
  tapButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  tapButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 5,
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
    color: '#ffd33d',
    fontSize: 80,
    fontWeight: 'bold',
  },
});