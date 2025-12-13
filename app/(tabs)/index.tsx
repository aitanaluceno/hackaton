import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

const BoldText = ({ children }) => <Text style={styles.boldText}>{children}</Text>;

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#444', dark: '#444' }} 
      headerImage={
        <Image
          source={require('@/assets/images/logos.png')}
          style={styles.headerImage} 
        />
      }
      style={styles.mainContainer} 
    >
      {/* Benvinguda*/}
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Benvingut/da a ICOnnecta't</ThemedText>
      </ThemedView>

      {/* OBJECTIUS */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.subTitle}>Objectius</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Aquesta aplicació ha estat dissenyada a partir del projecte "detecció i reacció" amb l'objectiu de monitorar i millorar els efectes cognitius i funcionals del càncer en la vida quotidiana, de manera sensible i ecològica. Oferint un tractament cognitiu personalitzat segons les necessitats de cada usuari.
          {'\n \n'}
          Per fer-ho s'han tingut en compte les dificultats cognitives que experimenten els pacients, dividint-les en quatre àrees principals per individualitzar el tractament al màxim possible.
          {'\n \n'}
          1. <BoldText>Fluència Verbal Alternant</BoldText>: Problemes per evocar paraules o fer-ho canviant la consigna (fonètica i semàntica).
          {'\n'}
          2. <BoldText>Atenció</BoldText>: Dificultat per mantenir els recursos atencionals sobre un estímul concret.
          {'\n'}
          3. <BoldText>Memòria de Treball</BoldText>: Incapacitat per mantenir i manipular la informació a curt termini per poder dur a terme tasques.
          {'\n'}
          4. <BoldText>Velocitat de Processament</BoldText>: La rapidesa amb què el cervell rep, interpreta i respon a un estímul (input).
        </ThemedText>
      </ThemedView>

      {/* FUNCIONALITATS */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.subTitle}>Funcionalitats</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Un cop informat/da passem amb les funcionalitats de l'aplicació. En un principi hauràs d'omplir un Formulari Inicial que ens servirà com a punt de partida per detectar en quines àrees necessites més suport. A partir del resultat es desbloquejaran la resta de funcions, totes adaptades a les teves necessitats i de la manera més personalitzada possible.
          {'\n \n'}
          1. <BoldText>Jocs</BoldText>: Diferents mini jocs canviants per millorar les habilitats i obtenir dades del progrés.
          {'\n'}
          2. <BoldText>Estadístiques</BoldText>: En aquest apartat es mostraran els resultats de les diferents proves juntament amb recursos per poder millorar en les àrees més afectades.
          {'\n'}
          3. <BoldText>Preguntes</BoldText>: Qüestionari de 10 afirmacions diàries que ens ajudaran a complementar els resultats obtinguts.
        </ThemedText>
      </ThemedView>

      {/* ACCÉS AL FORMULARI */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.subTitle}>Accedeix al formulari</ThemedText>
        <Link href="/modal" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Formulari Inicial</Text>
          </TouchableOpacity>
        </Link>
      </ThemedView>
      
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
    height: 125,
    width: 920,
    bottom: 60,
    left: 0,
    position: 'absolute',
    opacity: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
    backgroundColor: 'transparent',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', 
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
    backgroundColor: 'transparent', 
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 5,
    marginTop: 10,
  },
  sectionDescription: {
    color: '#ccc', 
    fontSize: 15,
    lineHeight: 24,
    backgroundColor: 'transparent',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#fff', 
  },
  actionButton: {
    marginTop: 5,
    backgroundColor: '#ffd33d', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffd33d',
  },
  actionButtonText: {
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});