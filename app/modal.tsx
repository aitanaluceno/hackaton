import { router } from 'expo-router';
import { Button, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFormStatus } from '@/context/estatformularicontext';

export default function ModalScreen() {
  const { completeForm } = useFormStatus(); 

  const handleComplete = () => {
    completeForm(); 
    
    router.back(); 
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Formulario de Configuración</ThemedText>
      
      <ThemedText style={styles.separator}>
        ¡Al presionar el botón de abajo, se desbloquearán todas las secciones de la aplicación!
      </ThemedText>

      {/* 🔴 BOTÓN DE ACCIÓN */}
      <Button 
        title="Completar y Desbloquear" 
        onPress={handleComplete} 
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  separator: {
    marginVertical: 20,
    maxWidth: '80%',
    textAlign: 'center',
  },
});