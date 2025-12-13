// Archivo: app/(tabs)/index.tsx

import { Image } from 'expo-image';
import { Button, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      {/* 🔴 NUEVO CONTENIDO DE BIENVENIDA Y BOTÓN */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenido/a</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Comienza Aquí</ThemedText>
        <ThemedText>
          {`Esta es la pantalla de inicio. Para desbloquear el resto de secciones 
          (Estadísticas, Juegos y Preguntas Diarias), debes completar el formulario inicial.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Accede al Formulario</ThemedText>
        {/* 🔴 BOTÓN QUE LLEVA AL MODAL */}
        <Link href="/modal" asChild>
          <Button title="Ir al Formulario" />
        </Link>
      </ThemedView>
      
      {/* Puedes eliminar el resto de ThemedView con "Step 1: Try it", "Step 2: Explore" y "Step 3: Get a fresh start" de tu código original, o dejarlos si los necesitas. Aquí solo incluí el nuevo contenido. */}
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});