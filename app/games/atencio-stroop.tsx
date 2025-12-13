import { useLocalSearchParams } from 'expo-router'; // <-- Hook per llegir paràmetres de la ruta
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

// Importa les funcions de la base de dades
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const currentUserId = 'USER_ID_PROVA_123'; // <-- RECORDA CANVIAR AIXÒ

// ==========================================================
// FUNCIÓ 1: ESCRIPTURA DE DADES (Guardar el resultat)
// ==========================================================

const saveGameResult = async (resultData: { score: number, avgResponseTime: number, gameId: string, difficulty: string }) => {
  try {
    const docRef = await addDoc(collection(db, 'game_results'), {
      userId: currentUserId,
      ...resultData,
      date: new Date().toISOString(), 
    });
    console.log("Resultat Stroop guardat amb ID: ", docRef.id);
  } catch (e) {
    console.error("Error guardant el resultat de Stroop: ", e);
    // Pots afegir un alert aquí per avisar l'usuari
  }
};

// ==========================================================
// COMPONENT PRINCIPAL
// ==========================================================

export default function AtencioStroopScreen() {
    // 1. LECTURA DEL PARÀMETRE DE DIFICULTAT PASSAT PER jocs.tsx
    const params = useLocalSearchParams();
    // params.difficulty serà 'Easy', 'Medium' o 'Hard', segons la personalització
    const difficulty = params.difficulty as string || 'Medium'; 
    const gameId = params.gameId as string || 'atencioStroop';

    const [gameStatus, setGameStatus] = useState<'running' | 'finished' | 'idle'>('idle');
    const [finalScore, setFinalScore] = useState(0);
    const [averageReactionTime, setAverageReactionTime] = useState(0);
    
    // Configura el joc segons la dificultat
    const gameSettings = {
        Hard: { timeLimit: 30, minResponseTime: 500 }, // Més curt, més ràpid
        Medium: { timeLimit: 45, minResponseTime: 700 },
        Easy: { timeLimit: 60, minResponseTime: 900 }, // Més llarg, menys pressió
    };
    
    const settings = gameSettings[difficulty as keyof typeof gameSettings] || gameSettings.Medium;

    // Aquesta funció simula el final del joc i crida a la funció de guardar
    const handleGameEnd = (score: number, totalTime: number) => {
        setGameStatus('finished');
        
        // Càlcul de la mètrica clau
        const avgTime = totalTime / score; // Això és una simplificació! 
        setFinalScore(score);
        setAverageReactionTime(avgTime);

        // 2. CRIDA A L'ESCRIPTURA DE DADES
        saveGameResult({
            score: score,
            avgResponseTime: avgTime,
            gameId: gameId,
            difficulty: difficulty,
        });
    };

    // --- CODI DE LA LÒGICA DEL JOC (Aquí aniria el teu codi real de Stroop) ---

    useEffect(() => {
        if (gameStatus === 'running') {
            console.log(`Joc iniciat amb dificultat: ${difficulty}. Límits de temps: ${settings.timeLimit}s.`);
            // Aquí començaria el temporitzador i la lògica del joc
            
            // SIMULACIÓ: El joc acaba als 5 segons amb una puntuació de 15 i un temps total de 12.3s
            const simulationTimer = setTimeout(() => {
                const simulatedScore = 15;
                const simulatedTotalResponseTime = 12.3;
                handleGameEnd(simulatedScore, simulatedTotalResponseTime);
            }, 5000); 

            return () => clearTimeout(simulationTimer);
        }
    }, [gameStatus, difficulty]);


    // --- RENDERITZAT ---
    
    if (gameStatus === 'idle') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Joc: {gameId}</Text>
                <Text style={styles.text}>Dificultat assignada: {difficulty}</Text>
                <Text style={styles.text}>El teu repte: {settings.timeLimit} segons de joc.</Text>
                <Button title="Començar Joc" onPress={() => setGameStatus('running')} />
            </View>
        );
    }

    if (gameStatus === 'running') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Joc en Curs... (Stroop)</Text>
                {/* Aquí aniria la interfície del teu joc */}
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Joc Finalitzat!</Text>
            <Text style={styles.text}>Puntuació: {finalScore}</Text>
            <Text style={styles.text}>Temps de reacció mitjà: {averageReactionTime.toFixed(2)}s</Text>
            <Text style={styles.success}>Dades guardades correctament a Firestore.</Text>
            <Button title="Tornar a Jocs" onPress={() => { /* Navegació */ }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222',
        padding: 20,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    text: { fontSize: 16, color: '#ccc', marginBottom: 10 },
    success: { fontSize: 16, color: 'lightgreen', marginTop: 20 },
});