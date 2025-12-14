import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

const ICONS = [
  'star',
  'heart',
  'flash',
  'moon',
  'flag',
  'flame',
  'leaf',
  'diamond'
];

export default function NBackGameScreen() {
  const router = useRouter();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [score, setScore] = useState(0);
  const [turns, setTurns] = useState(0); 
  
  const [history, setHistory] = useState<string[]>([]); 
  const [currentIcon, setCurrentIcon] = useState<string>('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [buttonDisabled, setButtonDisabled] = useState(false); 

  const historyRef = useRef<string[]>([]);
  
  const TOTAL_TURNS = 20; 
  const SPEED_MS = 2500;  

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === 'playing') {
      const nextTurn = () => {
        setFeedback('none'); 
        setButtonDisabled(false); 

        if (historyRef.current.length >= TOTAL_TURNS) {
          finishGame();
          return;
        }

        const shouldMatch = Math.random() < 0.3 && historyRef.current.length >= 2;
        
        let newIcon = '';
        if (shouldMatch) {
          newIcon = historyRef.current[historyRef.current.length - 2];
        } else {
          const avoidIcon = historyRef.current.length >= 2 ? historyRef.current[historyRef.current.length - 2] : '';
          const availableIcons = ICONS.filter(i => i !== avoidIcon);
          newIcon = availableIcons[Math.floor(Math.random() * availableIcons.length)];
        }

        historyRef.current.push(newIcon);
        setHistory([...historyRef.current]);
        setCurrentIcon(newIcon);
        setTurns(prev => prev + 1);
      };

      if (turns === 0) nextTurn();
      interval = setInterval(nextTurn, SPEED_MS);
    }

    return () => clearInterval(interval);
  }, [gameState, turns]);

  const startGame = () => {
    setScore(0);
    setTurns(0);
    setHistory([]);
    historyRef.current = [];
    setGameState('playing');
  };

  const handlePress = () => {
    if (buttonDisabled) return; 

    const historyLen = historyRef.current.length;
    
    if (historyLen < 3) {
        Vibration.vibrate(100);
        setFeedback('wrong');
        setButtonDisabled(true);
        return;
    }

    const currentItem = historyRef.current[historyLen - 1]; 
    const nBackItem = historyRef.current[historyLen - 3];   

    if (currentItem === nBackItem) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      Vibration.vibrate(50);
    } else {
      Vibration.vibrate(100);
      setFeedback('wrong');
    }
    setButtonDisabled(true);
  };

  const finishGame = () => {
    setGameState('finished');
    Vibration.vibrate([0, 500]);
  };

  if (gameState === 'intro') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Memòria: N-Back', headerTintColor: '#ffd33d', headerStyle: { backgroundColor: '#1e1e1e' } }} />
        
        {/* Icone Intro */}
        <Ionicons name="time" size={80} color="#4caf50" style={{marginBottom: 20}} />
        
        <Text style={styles.title}>2-Back: El Repte</Text>
        <Text style={styles.description}>
          Apareixeran icones una rere l'altra.
          {'\n\n'}
          Prem el botó <Text style={{fontWeight:'bold', color:'#fff'}}>COINCIDÈNCIA</Text> només si la icona actual és <Text style={{fontWeight:'bold', color:'#ffd33d'}}>IGUAL</Text> a la que ha sortit fa <Text style={{fontWeight:'bold', color:'#ffd33d'}}>2 torns</Text>.
          {'\n\n'}
          (Has de recordar la seqüència constantment!)
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
          
          <View style={styles.headerBar}>
            <Text style={styles.infoText}>Torn: {turns}/{TOTAL_TURNS}</Text>
            <Text style={styles.infoText}>Encerts: {score}</Text>
          </View>

          {/* zona joc */}
          <View style={styles.gameArea}>
            <View style={[
              styles.iconCard, 
              feedback === 'correct' && styles.borderGreen,
              feedback === 'wrong' && styles.borderRed
            ]}>
              {currentIcon ? (
                <Ionicons name={currentIcon as any} size={100} color="#fff" />
              ) : (
                <Text style={{color:'#666'}}>...</Text>
              )}
            </View>
            
            <Text style={styles.feedbackText}>
               {feedback === 'correct' ? "BÉ! +1" : feedback === 'wrong' ? "ERROR" : " "}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.matchButton, buttonDisabled && styles.buttonDisabled]} 
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <Text style={styles.matchButtonText}>COINCIDÈNCIA!</Text>
            <Text style={styles.subText}>(Igual que fa 2)</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>JOC COMPLETAT</Text>
      
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Has detectat:</Text>
        <Text style={styles.resultNumber}>{score}</Text>
        <Text style={styles.resultLabel}>Coincidències</Text>
      </View>

      <Text style={styles.description}>
        El 2-Back és un exercici molt exigent. Molt bona feina mantenint la concentració.
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
    fontSize: 16,
    fontWeight: '600',
  },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconCard: {
    width: 200,
    height: 200,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#555',
  },
  borderGreen: {
    borderColor: '#4caf50', 
  },
  borderRed: {
    borderColor: '#ff4444', 
  },
  feedbackText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    height: 30, 
  },
  matchButton: {
    backgroundColor: '#2196f3', 
    width: '100%',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  matchButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
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
    color: '#4caf50', 
    fontSize: 80,
    fontWeight: 'bold',
  },
});