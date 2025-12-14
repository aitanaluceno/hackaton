import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Vibration, SafeAreaView, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type LightColor = 'red' | 'green' | 'blue' | 'gray';

export default function SemaforGameScreen() {
  const router = useRouter();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [currentLight, setCurrentLight] = useState<LightColor>('gray');
  
  const [isErrorFlashing, setIsErrorFlashing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null); 
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null); 
  const isInputAllowed = useRef(false); 

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame();
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setGameState('playing');
    setIsErrorFlashing(false);
    scheduleNextLight(1000); 
  };

  const finishGame = () => {
    setGameState('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    Vibration.vibrate([0, 500]);
  };

  const scheduleNextLight = (delay: number) => {
    setCurrentLight('gray'); 
    isInputAllowed.current = false;
    
    gameLoopRef.current = setTimeout(() => {
      if (timeLeft <= 0) return;

      const r = Math.random();
      let nextColor: LightColor = 'gray';
      if (r < 0.4) nextColor = 'red';       
      else if (r < 0.8) nextColor = 'green'; 
      else nextColor = 'blue';              

      setCurrentLight(nextColor);
      isInputAllowed.current = true;

      if (nextColor === 'blue') {
          gameLoopRef.current = setTimeout(() => {
             scheduleNextLight(Math.random() * 800 + 400); 
          }, 1000); 
      }

    }, delay);
  };

  const handlePress = (side: 'left' | 'right') => {
    if (!isInputAllowed.current) return;
    if (currentLight === 'gray') return;

    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);

    let isCorrect = false;

    if (currentLight === 'green' && side === 'right') isCorrect = true;
    else if (currentLight === 'red' && side === 'left') isCorrect = true;
    else if (currentLight === 'blue') isCorrect = false; 
    else isCorrect = false; 

    if (isCorrect) {
      setScore(s => s + 1);
      Vibration.vibrate(15); 
    } else {
      triggerErrorFlash();
      Vibration.vibrate(100); 
    }

    isInputAllowed.current = false;
    const randomDelay = Math.random() * 1000 + 500; 
    scheduleNextLight(randomDelay); 
  };

  const triggerErrorFlash = () => {
      setIsErrorFlashing(true);
      setTimeout(() => {
          setIsErrorFlashing(false);
      }, 300);
  };


  if (gameState === 'intro') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Velocitat: Semàfor', headerTintColor: '#ffd33d', headerStyle: { backgroundColor: '#1e1e1e' } }} />
        
        <Ionicons name="hardware-chip-outline" size={80} color="#ff9800" style={{marginBottom: 20}} />
        
        <Text style={styles.title}>Semàfor Boig</Text>
        <Text style={styles.description}>
          Posa a prova els teus reflexos. Mira el llum central:
          {'\n\n'}
          🔴 <Text style={{fontWeight:'bold', color:'#ff4444'}}>VERMELL</Text> -> Prem botó <Text style={{fontWeight:'bold', color:'#fff'}}>ESQUERRE</Text>
          {'\n'}
          🟢 <Text style={{fontWeight:'bold', color:'#4caf50'}}>VERD</Text> -> Prem botó <Text style={{fontWeight:'bold', color:'#fff'}}>DRET</Text>
          {'\n'}
          🔵 <Text style={{fontWeight:'bold', color:'#2196f3'}}>BLAU</Text> -> <Text style={{fontWeight:'bold', color:'#fff'}}>NO FACIS RES!</Text>
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
          <Text style={styles.buttonText}>COMENÇAR JOC</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameState === 'playing') {
    return (
      <SafeAreaView style={[styles.safeArea, isErrorFlashing && styles.safeAreaErrorFlash]}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.containerPlaying}>
          
          <View style={styles.headerBar}>
            <Text style={styles.infoText}>Temps: {timeLeft}s</Text>
            <Text style={styles.infoText}>Punts: {score}</Text>
          </View>

          <View style={styles.gameArea}>
            <View style={styles.trafficLightHousing}>
                <View style={[
                    styles.lightCircle, 
                    currentLight === 'red' && styles.lightRed,
                    currentLight === 'green' && styles.lightGreen,
                    currentLight === 'blue' && styles.lightBlue,
                    currentLight === 'gray' && styles.lightOff,
                ]} />
            </View>
            {/* text error */}
            {isErrorFlashing && <Text style={styles.errorTextLabel}>ERROR!</Text>}
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity 
                style={[styles.controlButton, styles.btnLeft]} 
                onPress={() => handlePress('left')}
                activeOpacity={0.6}
            >
                <Ionicons name="arrow-back" size={40} color="#fff" />
                <Text style={styles.btnLabel}>ESQUERRE</Text>
                <View style={[styles.colorIndicator, {backgroundColor: '#ff4444'}]} />
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.controlButton, styles.btnRight]} 
                onPress={() => handlePress('right')}
                activeOpacity={0.6}
            >
                <Ionicons name="arrow-forward" size={40} color="#fff" />
                <Text style={styles.btnLabel}>DRET</Text>
                <View style={[styles.colorIndicator, {backgroundColor: '#4caf50'}]} />
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>PARTIDA ACABADA</Text>
      
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Puntuació Final:</Text>
        <Text style={styles.resultNumber}>{score}</Text>
      </View>

      <Text style={styles.description}>
        La velocitat de processament es millora amb la pràctica. Els temps d'espera variables ajuden a mantenir l'atenció alerta.
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
  safeAreaErrorFlash: {
    backgroundColor: '#500', 
  },
  containerPlaying: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoText: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  trafficLightHousing: {
    width: 150,
    height: 150,
    backgroundColor: '#000',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#333',
    elevation: 10,
  },
  lightCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  lightOff: { backgroundColor: '#333' },
  lightRed: { 
    backgroundColor: '#ff4444',
    shadowColor: '#ff4444', shadowOpacity: 1, shadowRadius: 20, elevation: 20 
  },
  lightGreen: { 
    backgroundColor: '#4caf50',
    shadowColor: '#4caf50', shadowOpacity: 1, shadowRadius: 20, elevation: 20 
  },
  lightBlue: { 
    backgroundColor: '#2196f3',
    shadowColor: '#2196f3', shadowOpacity: 1, shadowRadius: 20, elevation: 20 
  },

  errorTextLabel: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 20,
  },

  controlsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  controlButton: {
    flex: 1,
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
    backgroundColor: '#2c2c2c',
  },
  btnLeft: {},
  btnRight: {},
  colorIndicator: {
    width: '100%',
    height: 10,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
  },
  btnLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
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
    color: '#ff9800', 
    fontSize: 80,
    fontWeight: 'bold',
  },
});