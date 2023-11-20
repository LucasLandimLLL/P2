import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export default function FormLivro({ route }) {
  const navigation = useNavigation();
  const { acao, livro: livroAntigo } = route.params;

  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [turno, setTurno] = useState('');
  const [curso, setCurso] = useState('');
  const [showMensagemErro, setShowMensagemErro] = useState(false);

  useEffect(() => {
    if (livroAntigo) {
      setNome(livroAntigo.nome);
      setMatricula(livroAntigo.matricula);
      setTurno(livroAntigo.turno);
      setCurso(livroAntigo.curso);
    }
  }, [livroAntigo]);

  function salvar() {
    if (nome === '' || matricula === '' || turno === '' || curso === '') {
      setShowMensagemErro(true);
    } else {
      setShowMensagemErro(false);

      const livroNovo = {
        nome: nome,
        matricula: matricula,
        turno: turno,
        curso: curso,
      };

      if (livroAntigo) {
        acao(livroAntigo, livroNovo);
      } else {
        acao(livroNovo);
      }

      Toast.show({
        type: 'success',
        text1: 'Livro salvo com sucesso!',
      });

      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {livroAntigo ? 'Editar Livro' : 'Adicionar Livro'}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label={'Livro'}
          mode="outlined"
          value={nome}
          onChangeText={(text) => setNome(text)}
        />
        <TextInput
          style={styles.input}
          label={'Pagina'}
          mode="outlined"
          keyboardType="numeric"
          value={matricula}
          onChangeText={(text) => setMatricula(text)}
        />
        <TextInput
          style={styles.input}
          label={'Autor'}
          mode="outlined"
          value={turno}
          onChangeText={(text) => setTurno(text)}
        />
        <TextInput
          style={styles.input}
          label={'Comentario'}
          mode="outlined"
          value={curso}
          onChangeText={(text) => setCurso(text)}
        />
        {showMensagemErro && (
          <Text style={{ color: 'red', textAlign: 'center' }}>Preencha todos os campos!</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} mode="contained-tonal" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
        <Button style={styles.button} mode="contained" onPress={salvar}>
          Salvar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    margin: 10,
  },
  inputContainer: {
    width: '90%',
    flex: 1,
  },
  input: {
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
  },
});
