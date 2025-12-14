import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BoldText = ({ children }: { children: React.ReactNode }) => <Text style={styles.boldText}>{children}</Text>;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* logo i benvinguda */}
        <ThemedView style={styles.headerContainer}>
          {/* LOGOTIP */}
          <Image
            source={require('@/assets/images/logo_kognia.png')}
            style={styles.headerLogo} 
            contentFit="contain" 
          />
          {/* BENVINGUDA */}
          <ThemedText style={styles.titleText}>Benvingut/da a Kognia</ThemedText>
        </ThemedView>
        {}

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
        
        {/* Espai extra al final */}
        <View style={{height: 40}} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#444', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  headerContainer: {
    alignItems: 'center', 
    marginBottom: 30,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  headerLogo: {
    width: 150,  
    height: 150, 
    marginBottom: 15, 
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', 
    textAlign: 'center', 
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