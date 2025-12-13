import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import LockedScreen from '@/components/pantallabloqueig';
import { useFormStatus } from '@/context/estatformularicontext';

// Componente auxiliar para texto en negrita
const BoldText = ({ children }) => (
  <ThemedText type="defaultSemiBold" style={{ color: '#fff', fontWeight: 'bold' }}>
    {children}
  </ThemedText>
);

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#444', // Fondo principal
    flex: 1,
    padding: 20,
    minHeight: 900,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  // Estilos para el bloque de juego
  gameContainer: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#666', // Borde sutil
  },
  gameTitle: {
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: '#353535', // Color de fondo para las instrucciones
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
  },
  instructionsHeader: {
    color: '#fff',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  instructionText: {
    color: '#ccc', // Gris claro para el cuerpo del texto
    lineHeight: 22,
  },
  // Estilos del botón de acción (amarillo #ffd33d)
  actionButton: {
    marginTop: 10,
    backgroundColor: '#ffd33d', // Color amarillo solicitado
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffd33d',
  },
  actionButtonText: {
    color: '#000', // Texto negro en el botón amarillo
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionSeparator: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});
// *******************************************************************

export default function TabTwoScreen() {
  const { isFormCompleted } = useFormStatus();

  // Color de fondo para el ParallaxScrollView
  const HEADER_BACKGROUND_COLOR = '#444';

  if (!isFormCompleted) {
    return <LockedScreen />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: HEADER_BACKGROUND_COLOR, dark: HEADER_BACKGROUND_COLOR }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage} 
        />
      }
      style={styles.mainContainer}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            color: '#fff', // Título en blanco
          }}>
          Jocs de Treball
        </ThemedText>
      </ThemedView>

      {/* Bloque de Juego 1: Fluència Verbal (Tormenta de Categorías) */}
      <ThemedView style={styles.gameContainer}>
        <ThemedText style={styles.gameTitle} type="subtitle">
          1. Fluència Verbal: Tempesta de Categories ⛈️
        </ThemedText>
        
        <ThemedView style={styles.instructionsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.instructionsHeader}>
            Instruccions
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            L'objectiu és "activar" el teu magatzem de paraules el més ràpid possible.
            {'\n \n'}
            <BoldText>Dinàmica:</BoldText> Apareixerà una categoria a la pantalla (per exemple: <BoldText>"Coses que caben en una maleta"</BoldText> o <BoldText>"Fruites vermelles"</BoldText>).
            {'\n \n'}
            <BoldText>Temps:</BoldText> Tens exactament <BoldText>30 segons</BoldText> per dir en veu alta totes les coses que se t'acudint d'aquesta categoria.
            {'\n \n'}
            <BoldText>Benefici:</BoldText> Aquest exercici millora la teva fluïdesa semàntica i l'agilitat mental.
          </ThemedText>
        </ThemedView>

        {/* Botón de Acceso al Juego */}
        <Link href="/games/fluencia-verbal" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Jugar: Tempesta de Categories</Text>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      {/* Bloque de Juego 2: Atenció (Efecte Stroop) */}
      <ThemedView style={styles.gameContainer}>
        <ThemedText style={styles.gameTitle} type="subtitle">
          2. Atenció: Colors Mentiders 🎨
        </ThemedText>
        
        <ThemedView style={styles.instructionsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.instructionsHeader}>
            Instruccions
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            Entrena la teva capacitat d'inhibició i atenció selectiva.
            {'\n \n'}
            <BoldText>Dinàmica:</BoldText> Veuràs una paraula pintada d'un color (ex: la paraula "VERD" pintada de color vermell).
            {'\n \n'}
            <BoldText>El Repte:</BoldText> Hauràs de respondre segons el que et demani l'app: <BoldText>"Què hi posa?"</BoldText> o <BoldText>"Quin color és?"</BoldText>.
            {'\n \n'}
            <BoldText>Rapidesa:</BoldText> Tens 45 segons per encertar el màxim possible.
          </ThemedText>
        </ThemedView>

        <Link href="/games/atencio-stroop" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Jugar: Efecte Stroop</Text>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      {/* Bloque de Juego 3: Memòria N-Back */}
      <ThemedView style={styles.gameContainer}>
        <ThemedText style={styles.gameTitle} type="subtitle">
          3. Memòria de Treball: N-Back 🧠
        </ThemedText>
        
        <ThemedView style={styles.instructionsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.instructionsHeader}>
            Instruccions
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            L'estàndard d'or per entrenar la memòria de treball.
            {'\n \n'}
            <BoldText>Dinàmica:</BoldText> Van apareixent icones una rere l'altra cada 2,5 segons.
            {'\n \n'}
            <BoldText>L'Objectiu:</BoldText> Has de prémer el botó si la imatge actual és <BoldText>LA MATEIXA</BoldText> que la que ha sortit fa <BoldText>2 TORNS</BoldText>.
            {'\n \n'}
            <BoldText>Exemple:</BoldText> Estrella... Cor... <BoldText>Estrella</BoldText> (Prem!)
          </ThemedText>
        </ThemedView>

        <Link href="/games/memoria-nback" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Jugar: N-Back (2 passos)</Text>
          </TouchableOpacity>
        </Link>
      </ThemedView>


      {/* Bloque de Juego 4: Velocidad de Procesamiento */}
      <ThemedView style={styles.gameContainer}>
        <ThemedText style={styles.gameTitle} type="subtitle">
          4. Velocitat: Semàfor Boig 🚦
        </ThemedText>
        
        <ThemedView style={styles.instructionsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.instructionsHeader}>
            Instruccions
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            Reacciona tan ràpid com puguis al color, no a la posició!
            {'\n \n'}
            🔴 <BoldText>VERMELL</BoldText>: Prem el botó <BoldText>ESQUERRE</BoldText>.
            {'\n'}
            🟢 <BoldText>VERD</BoldText>: Prem el botó <BoldText>DRET</BoldText>.
            {'\n'}
            🔵 <BoldText>BLAU</BoldText>: <BoldText>QUIET!</BoldText> (No premis res).
            {'\n \n'}
            <BoldText>Clau:</BoldText> El temps entre llums canvia, no t'adormis!
          </ThemedText>
        </ThemedView>

        <Link href="/games/velocitat-semafor" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Jugar: Semàfor Boig</Text>
          </TouchableOpacity>
        </Link>
      </ThemedView>

    </ParallaxScrollView>
  );
}