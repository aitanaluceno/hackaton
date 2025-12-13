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
      <ThemedText type="title">Formulari inicial</ThemedText>
      
      <ThemedText style={styles.separator}>
        A continuació haurás de realitzar quatre activitats per evaular cadascuna de les àrees esmentades. Comencem!
      </ThemedText>

    

      {/* botó */}
      <Button 
        title="completar y desbloquejar" 
        onPress={handleComplete}
        color="#ffd33d" 
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