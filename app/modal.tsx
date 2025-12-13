import { useFormStatus } from '@/context/estatformularicontext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';


const DIRECT_MIN_DIGITS = 4;
const DIRECT_MAX_DIGITS = 9;
const INVERS_MIN_DIGITS = 2; 
const INVERS_MAX_DIGITS = 8;
const ATTEMPTS_PER_LEVEL = 2;
const VP_TOTAL_NUMBERS = 25;
const SIMULATE_VOICE = true; 

export default function DiagnosticModalScreen() {
  const router = useRouter();
  const { completeForm } = useFormStatus();


  const [step, setStep] = useState<
    'welcome' | 
    'f_intro' | 'f_pre' | 'f_playing' | 'f_result' |
    'a_intro' | 'a_memorize' | 'a_verify' | 'a_result' |
    'di_intro' | 'di_memorize' | 'di_verify' | 'di_result' | 
    'vp_intro' | 'vp_playing' | 'vp_result' |
    'unlock'
  >('welcome');

  const [fluenciaTime, setFluenciaTime] = useState(60);
  const [fluenciaScore, setFluenciaScore] = useState(0);
  const [fluenciaCat, setFluenciaCat] = useState("FRUITES I VERDURES");

  const [digitsLevel, setDigitsLevel] = useState(0); 
  const [digitsAttempt, setDigitsAttempt] = useState(1); 
  const [digitsFailures, setDigitsFailures] = useState(0); 
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null); 
  const [atencioScore, setAtencioScore] = useState(0); 
  const [memoriaScore, setMemoriaScore] = useState(0); 

  // --- ESTATS VELOCITAT ---
  const [vpNumbers, setVpNumbers] = useState<number[]>([]); 
  const [vpNextTarget, setVpNextTarget] = useState(1); 
  const [vpTimeElapsed, setVpTimeElapsed] = useState(0); 

  // Refs timers
  const sequenceRef = useRef<NodeJS.Timeout | null>(null);
  const vpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null); // Ref per la simulació de veu

  // ---------------------------------------------------------
  // 🎙️ SIMULACIÓ DE VEU (TRUC DEMO)
  // ---------------------------------------------------------
  useEffect(() => {
    if (step === 'f_playing' && SIMULATE_VOICE) {
      // Funció que afegeix una paraula cada X temps aleatori
      const scheduleNextWord = () => {
        const randomDelay = Math.random() * 2000 + 1500; // Entre 1.5s i 3.5s
        simulationRef.current = setTimeout(() => {
          if (step === 'f_playing' && fluenciaTime > 0) {
            addFluenciaWord(); // Suma punt
            scheduleNextWord(); // Programa la següent
          }
        }, randomDelay);
      };
      scheduleNextWord();
    }
    return () => {
      if (simulationRef.current) clearTimeout(simulationRef.current);
    };
  }, [step, fluenciaTime]);


  // Timer Fluència
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'f_playing' && fluenciaTime > 0) {
      interval = setInterval(() => setFluenciaTime(t => t - 1), 1000);
    } else if (fluenciaTime === 0 && step === 'f_playing') {
      finishFluencia();
    }
    return () => clearInterval(interval);
  }, [step, fluenciaTime]);

  // Timer Velocitat
  useEffect(() => {
    if (step === 'vp_playing') {
      vpTimerRef.current = setInterval(() => {
        setVpTimeElapsed(prev => prev + 1);
      }, 1000); 
    }
    return () => {
      if (vpTimerRef.current) clearInterval(vpTimerRef.current);
    };
  }, [step]);

  // Reproductor Seqüències
  useEffect(() => {
    if (step === 'a_memorize' || step === 'di_memorize') {
      playSequence();
    }
    return () => {
      if (sequenceRef.current) clearTimeout(sequenceRef.current);
    };
  }, [step, currentSequence]);

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------
  const generateSequence = (length: number) => {
    const newSeq = Array.from({ length }, () => Math.floor(Math.random() * 10));
    setCurrentSequence(newSeq);
    setDisplayNumber(null);
  };

  const playSequence = async () => {
    let i = 0;
    sequenceRef.current = setTimeout(() => {
        const showNext = () => {
          if (i < currentSequence.length) {
            setDisplayNumber(currentSequence[i]);
            i++;
            sequenceRef.current = setTimeout(() => {
              setDisplayNumber(null);
              if (i < currentSequence.length) {
                sequenceRef.current = setTimeout(showNext, 300); 
              } else {
                if (step === 'a_memorize') setStep('a_verify');
                else if (step === 'di_memorize') setStep('di_verify');
              }
            }, 1000); 
          }
        };
        showNext();
    }, 1000);
  };

  // ---------------------------------------------------------
  // 1. FLUÈNCIA VERBAL
  // ---------------------------------------------------------
  const startFluencia = () => setStep('f_playing');
  const addFluenciaWord = () => { setFluenciaScore(s => s + 1); Vibration.vibrate(50); };
  const finishFluencia = () => { 
    if (simulationRef.current) clearTimeout(simulationRef.current);
    Vibration.vibrate([0, 500]); 
    setStep('f_result'); 
  };

  // ---------------------------------------------------------
  // 2. ATENCIÓ (DIRECTES)
  // ---------------------------------------------------------
  const startAtencio = () => {
    setDigitsLevel(DIRECT_MIN_DIGITS);
    setDigitsAttempt(1);
    setDigitsFailures(0);
    setAtencioScore(0);
    generateSequence(DIRECT_MIN_DIGITS);
    setStep('a_memorize');
  };

  const handleAtencioAnswer = (correct: boolean) => {
    if (correct) {
      if (digitsLevel > atencioScore) setAtencioScore(digitsLevel);
      nextLevelDirectes();
    } else {
      const newFailures = digitsFailures + 1;
      if (newFailures >= ATTEMPTS_PER_LEVEL) finishAtencio();
      else {
        setDigitsFailures(newFailures);
        setDigitsAttempt(2);
        generateSequence(digitsLevel);
        setStep('a_memorize');
      }
    }
  };

  const nextLevelDirectes = () => {
    if (digitsLevel >= DIRECT_MAX_DIGITS) { setAtencioScore(DIRECT_MAX_DIGITS); finishAtencio(); }
    else {
      const nextLvl = digitsLevel + 1;
      setDigitsLevel(nextLvl);
      setDigitsAttempt(1);
      setDigitsFailures(0);
      generateSequence(nextLvl);
      setStep('a_memorize');
    }
  };

  const finishAtencio = () => {
    if (sequenceRef.current) clearTimeout(sequenceRef.current);
    Vibration.vibrate([0, 500]);
    setStep('a_result');
  };

  // ---------------------------------------------------------
  // 3. MEMÒRIA TREBALL (INVERSOS)
  // ---------------------------------------------------------
  const startInversos = () => {
    setDigitsLevel(INVERS_MIN_DIGITS); 
    setDigitsAttempt(1);
    setDigitsFailures(0);
    setMemoriaScore(0);
    generateSequence(INVERS_MIN_DIGITS);
    setStep('di_memorize');
  };

  const handleInversosAnswer = (correct: boolean) => {
    if (correct) {
      if (digitsLevel > memoriaScore) setMemoriaScore(digitsLevel);
      nextLevelInversos();
    } else {
      const newFailures = digitsFailures + 1;
      if (newFailures >= ATTEMPTS_PER_LEVEL) finishInversos();
      else {
        setDigitsFailures(newFailures);
        setDigitsAttempt(2);
        generateSequence(digitsLevel);
        setStep('di_memorize');
      }
    }
  };

  const nextLevelInversos = () => {
    if (digitsLevel >= INVERS_MAX_DIGITS) { setMemoriaScore(INVERS_MAX_DIGITS); finishInversos(); }
    else {
      const nextLvl = digitsLevel + 1;
      setDigitsLevel(nextLvl);
      setDigitsAttempt(1);
      setDigitsFailures(0);
      generateSequence(nextLvl);
      setStep('di_memorize');
    }
  };

  const finishInversos = () => {
    if (sequenceRef.current) clearTimeout(sequenceRef.current);
    Vibration.vibrate([0, 500]);
    setStep('di_result');
  };

  // ---------------------------------------------------------
  // 4. VELOCITAT (TMT-A)
  // ---------------------------------------------------------
  const startVP = () => {
    const nums = Array.from({ length: VP_TOTAL_NUMBERS }, (_, i) => i + 1);
    const shuffled = nums.sort(() => Math.random() - 0.5);
    setVpNumbers(shuffled);
    setVpNextTarget(1);
    setVpTimeElapsed(0);
    setStep('vp_playing');
  };

  const handleVPPress = (number: number) => {
    if (number === vpNextTarget) {
      Vibration.vibrate(10); 
      if (number === VP_TOTAL_NUMBERS) finishVP();
      else setVpNextTarget(prev => prev + 1);
    } else {
      Vibration.vibrate(100);
    }
  };

  const finishVP = () => {
    if (vpTimerRef.current) clearInterval(vpTimerRef.current);
    Vibration.vibrate([0, 500]);
    setStep('vp_result');
  };

  // ---------------------------------------------------------
  // GLOBAL
  // ---------------------------------------------------------
  const handleUnlockApp = () => {
    completeForm();
    router.back();
  };

  // =========================================================
  // RENDERITZAT
  // =========================================================

  if (step === 'welcome') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Avaluació Inicial</Text>
        <View style={styles.separator}>
          <Ionicons name="clipboard" size={60} color="#ffd33d" style={{marginBottom: 20}} />
          <Text style={styles.description}>
            Per personalitzar l'entrenament, farem 4 proves ràpides:
            {'\n\n'}
            1. Fluència Verbal
            {'\n'}
            2. Atenció
            {'\n'}
            3. Memòria de Treball
            {'\n'}
            4. Velocitat de Processament
          </Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('f_intro')}>
          <Text style={styles.buttonText}>COMENÇAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- 1. FLUÈNCIA ---
  if (step === 'f_intro') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Prova 1: Fluència</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionHeader}>CONSIGNA:</Text>
          <Text style={styles.instructionText}>
            Et direm una <Text style={styles.highlight}>categoria</Text>.
            Hauràs de dir en veu alta tantes paraules com puguis en 60 segons.
          </Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('f_pre')}>
          <Text style={styles.buttonText}>ENTESOS</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (step === 'f_pre') {
    return (
      <View style={styles.container}>
        <Text style={styles.subTitle}>La categoria és:</Text>
        <View style={styles.categoryCard}>
          <Ionicons name="nutrition" size={50} color="#fff" />
          <Text style={styles.categoryText}>{fluenciaCat}</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={startFluencia}>
          <Text style={styles.buttonText}>COMENÇAR ARA</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (step === 'f_playing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.gameContainer}>
          <View style={styles.timerHeader}>
            <Text style={styles.timerLabel}>TEMPS</Text>
            <Text style={[styles.timerValue, fluenciaTime <= 10 && styles.textRed]}>{fluenciaTime}</Text>
          </View>
          
          {/* MICROFONO */}
          <View style={styles.micContainer}>
            {/* Si està simulant, fem que el micro parpellegi */}
            <View style={[styles.micCircle, SIMULATE_VOICE && {opacity: (fluenciaTime % 2 === 0 ? 1 : 0.7)}]}>
                <Ionicons name="mic" size={60} color="#1e1e1e" />
            </View>
            <Text style={styles.listeningText}>
                {SIMULATE_VOICE ? "Detectant veu (Simulat)..." : "Escoltant..."}
            </Text>
          </View>

          <View style={styles.currentStats}>
             <Text style={styles.statsLabel}>Paraules detectades:</Text>
             <Text style={styles.statsValue}>{fluenciaScore}</Text>
          </View>
          
          <TouchableOpacity style={styles.detectButton} onPress={addFluenciaWord} activeOpacity={0.7}>
            <Text style={styles.detectButtonText}>+1 PARAULA (Manual)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={finishFluencia}>
            <Text style={styles.skipButtonText}>SALTAR ⏩</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  if (step === 'f_result') {
    return (
      <View style={styles.container}>
        <Text style={styles.fiTitle}>FI PROVA 1</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Resultat:</Text>
          <Text style={styles.resultNumber}>{fluenciaScore}</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('a_intro')}>
          <Text style={styles.buttonText}>SEGÜENT: ATENCIÓ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- 2. ATENCIÓ ---
  if (step === 'a_intro') {
    return (
      <View style={styles.container}>
        <Ionicons name="ear-outline" size={80} color="#ffd33d" style={{marginBottom:20}} />
        <Text style={styles.title}>Prova 2: Atenció</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionHeader}>CONSIGNA:</Text>
          <Text style={styles.instructionText}>
            Et mostrarem una sèrie de números.
            Quan acabin, els hauràs de <Text style={styles.highlight}>repetir en el mateix ordre</Text>.
          </Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={startAtencio}>
          <Text style={styles.buttonText}>COMENÇAR</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (step === 'a_memorize' || step === 'di_memorize') {
    const handleSkip = step === 'a_memorize' ? finishAtencio : finishInversos;
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <Text style={styles.subTitle}>Memoritza la seqüència</Text>
          <View style={styles.numberDisplay}>
             {displayNumber !== null ? <Text style={styles.bigNumber}>{displayNumber}</Text> : <View style={styles.numberPlaceholder} />}
          </View>
          <Text style={styles.levelIndicator}>Nivell: {digitsLevel} números</Text>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>SALTAR ⏩</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  if (step === 'a_verify') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.gameContainer}>
          <Text style={styles.title}>El teu torn</Text>
          <Text style={styles.description}>Repeteix els números en el <Text style={styles.highlight}>mateix ordre</Text>.</Text>
          <View style={styles.solutionBox}>
            <Text style={styles.solutionLabel}>SOLUCIÓ:</Text>
            <Text style={styles.solutionText}>{currentSequence.join(' - ')}</Text>
          </View>
          <Text style={styles.questionText}>Ho has dit bé?</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.choiceButton, styles.btnWrong]} onPress={() => handleAtencioAnswer(false)}>
              <Ionicons name="close" size={30} color="#fff" /><Text style={styles.choiceText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.choiceButton, styles.btnCorrect]} onPress={() => handleAtencioAnswer(true)}>
              <Ionicons name="checkmark" size={30} color="#fff" /><Text style={styles.choiceText}>Sí</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.skipButton} onPress={finishAtencio}>
            <Text style={styles.skipButtonText}>SALTAR ⏩</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  if (step === 'a_result') {
    return (
      <View style={styles.container}>
        <Text style={styles.fiTitle}>FI PROVA 2</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Nivell Directe:</Text>
          <Text style={styles.resultNumber}>{atencioScore}</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('di_intro')}>
          <Text style={styles.buttonText}>SEGÜENT: MEMÒRIA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- 3. MEMÒRIA TREBALL ---
  if (step === 'di_intro') {
    return (
      <View style={styles.container}>
        <Ionicons name="arrow-undo-outline" size={80} color="#4caf50" style={{marginBottom:20}} />
        <Text style={styles.title}>Prova 3: Memòria</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionHeader}>CONSIGNA:</Text>
          <Text style={styles.instructionText}>
            Et mostrarem una sèrie de números.
            Has de repetir-los en <Text style={[styles.highlight, {color:'#4caf50'}]}>ORDRE INVERS</Text> (del final al principi).
          </Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={startInversos}>
          <Text style={styles.buttonText}>COMENÇAR</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (step === 'di_verify') {
    const reversedSeq = [...currentSequence].reverse();
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.gameContainer}>
          <Text style={styles.title}>El teu torn</Text>
          <Text style={styles.description}>Repeteix els números <Text style={[styles.highlight, {color:'#4caf50'}]}>A L'INREVÉS</Text>.</Text>
          <View style={styles.solutionBox}>
            <Text style={styles.solutionLabel}>SOLUCIÓ INVERSA:</Text>
            <Text style={styles.solutionText}>{reversedSeq.join(' - ')}</Text>
          </View>
          <Text style={styles.questionText}>Ho has dit bé?</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.choiceButton, styles.btnWrong]} onPress={() => handleInversosAnswer(false)}>
              <Ionicons name="close" size={30} color="#fff" /><Text style={styles.choiceText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.choiceButton, styles.btnCorrect]} onPress={() => handleInversosAnswer(true)}>
              <Ionicons name="checkmark" size={30} color="#fff" /><Text style={styles.choiceText}>Sí</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.skipButton} onPress={finishInversos}>
            <Text style={styles.skipButtonText}>SALTAR ⏩</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  if (step === 'di_result') {
    return (
      <View style={styles.container}>
        <Text style={styles.fiTitle}>FI PROVA 3</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Nivell Invers:</Text>
          <Text style={styles.resultNumber}>{memoriaScore}</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('vp_intro')}>
          <Text style={styles.buttonText}>SEGÜENT: VELOCITAT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- 4. VELOCITAT (TMT-A) ---
  if (step === 'vp_intro') {
    return (
      <View style={styles.container}>
        <Ionicons name="timer-outline" size={80} color="#2196f3" style={{marginBottom:20}} />
        <Text style={styles.title}>Prova 4: Velocitat</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionHeader}>CONSIGNA:</Text>
          <Text style={styles.instructionText}>
            Apareixeran números del <Text style={styles.highlight}>1 al 25</Text> desordenats.
            {'\n\n'}
            Prem-los en <Text style={styles.highlight}>ordre ascendent</Text> (1, 2, 3...) el més ràpid possible.
          </Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={startVP}>
          <Text style={styles.buttonText}>COMENÇAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'vp_playing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.vpContainer}>
            <View style={styles.vpHeader}>
                <Text style={styles.vpLabel}>SEGÜENT: <Text style={{fontSize:24, color:'#ffd33d'}}>{vpNextTarget}</Text></Text>
                <Text style={styles.vpLabel}>TEMPS: <Text style={{fontSize:24, color:'#fff'}}>{vpTimeElapsed}s</Text></Text>
            </View>

            <View style={styles.vpGrid}>
                {vpNumbers.map((num) => {
                    const isPressed = num < vpNextTarget;
                    if (isPressed) return <View key={num} style={[styles.vpCell, styles.vpCellHidden]} />;
                    return (
                        <TouchableOpacity 
                            key={num} 
                            style={styles.vpCell} 
                            onPress={() => handleVPPress(num)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.vpCellText}>{num}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity style={styles.skipButton} onPress={finishVP}>
                <Text style={styles.skipButtonText}>SALTAR ⏩</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'vp_result') {
    return (
      <View style={styles.container}>
        <Text style={styles.fiTitle}>FI PROVA 4</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Temps Total:</Text>
          <Text style={styles.resultNumber}>{vpTimeElapsed}s</Text>
        </View>
        <TouchableOpacity style={styles.unlockButton} onPress={() => setStep('unlock')}>
          <Text style={styles.unlockButtonText}>FINALITZAR TOT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- UNLOCK ---
  if (step === 'unlock') {
    return (
      <View style={styles.container}>
        <Ionicons name="lock-open" size={80} color="#ffd33d" style={{marginBottom:20}} />
        <Text style={styles.title}>Avaluació Completada!</Text>
        <Text style={styles.description}>
          Hem recollit dades de les 4 àrees clau.
          L'aplicació s'ha adaptat al teu nivell.
        </Text>
        <TouchableOpacity style={styles.unlockButton} onPress={handleUnlockApp}>
          <Text style={styles.unlockButtonText}>ENTRAR A L'APP 🚀</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', alignItems: 'center', justifyContent: 'center', padding: 20 },
  safeArea: { flex: 1, backgroundColor: '#1e1e1e' },
  gameContainer: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 50 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  subTitle: { fontSize: 20, color: '#ccc', marginBottom: 20 },
  description: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  separator: { alignItems: 'center', marginBottom: 40 },
  highlight: { color: '#ffd33d', fontWeight: 'bold' },

  instructionBox: { backgroundColor: '#333', padding: 20, borderRadius: 15, width: '100%', marginBottom: 40, borderLeftWidth: 4, borderLeftColor: '#ffd33d' },
  instructionHeader: { color: '#ffd33d', fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
  instructionText: { color: '#e0e0e0', fontSize: 16, lineHeight: 24 },

  categoryCard: { backgroundColor: '#ffd33d', padding: 30, borderRadius: 20, alignItems: 'center', width: '100%', marginBottom: 30 },
  categoryText: { color: '#1e1e1e', fontSize: 26, fontWeight: '900', marginTop: 10, textTransform: 'uppercase' },
  
  timerHeader: { alignItems: 'center' },
  timerLabel: { color: '#888', fontSize: 14, fontWeight: 'bold' },
  timerValue: { color: '#fff', fontSize: 60, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  textRed: { color: '#ff4444' },

  micContainer: { alignItems: 'center', justifyContent: 'center' },
  micCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ffd33d', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  listeningText: { color: '#ccc', fontStyle: 'italic', fontSize: 16 },
  
  currentStats: { alignItems: 'center' },
  statsLabel: { color: '#aaa', fontSize: 16 },
  statsValue: { color: '#fff', fontSize: 40, fontWeight: 'bold' },

  numberDisplay: { height: 150, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  bigNumber: { fontSize: 120, fontWeight: 'bold', color: '#ffd33d' },
  numberPlaceholder: { width: 20, height: 20 },
  levelIndicator: { marginTop: 40, color: '#666', fontSize: 14, textTransform: 'uppercase' },
  
  solutionBox: { backgroundColor: '#333', padding: 20, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 20 },
  solutionLabel: { color: '#888', fontSize: 12, marginBottom: 5 },
  solutionText: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 2 },
  
  questionText: { color: '#fff', fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', gap: 20, width: '100%', justifyContent: 'center' },
  choiceButton: { flex: 1, padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  btnWrong: { backgroundColor: '#c62828' },
  btnCorrect: { backgroundColor: '#2e7d32' },
  choiceText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  primaryButton: { backgroundColor: '#ffd33d', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 12, width: '100%', alignItems: 'center' },
  buttonText: { color: '#1e1e1e', fontSize: 18, fontWeight: '900', textTransform: 'uppercase' },
  detectButton: { backgroundColor: '#333', paddingVertical: 20, borderRadius: 15, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  detectButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  fiTitle: { fontSize: 60, fontWeight: '900', color: '#ff4444', marginBottom: 20, textAlign: 'center' },
  resultBox: { backgroundColor: '#2c2c2c', padding: 30, borderRadius: 20, alignItems: 'center', width: '100%', marginBottom: 30, borderWidth: 1, borderColor: '#444' },
  resultLabel: { color: '#aaa', fontSize: 18 },
  resultNumber: { color: '#ffd33d', fontSize: 60, fontWeight: 'bold' },
  
  unlockButton: { backgroundColor: '#4caf50', paddingVertical: 18, borderRadius: 15, width: '100%', alignItems: 'center', marginTop: 10, elevation: 5 },
  unlockButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },

  skipButton: { marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#666', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  skipButtonText: { color: '#aaa', fontSize: 14, fontWeight: 'bold' },

  vpContainer: { flex: 1, padding: 10, alignItems: 'center', justifyContent: 'space-between' },
  vpHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20, paddingHorizontal: 10 },
  vpLabel: { color: '#aaa', fontSize: 14, fontWeight: 'bold' },
  vpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  vpCell: {
    width: 60, 
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  vpCellHidden: { opacity: 0 },
  vpCellText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});