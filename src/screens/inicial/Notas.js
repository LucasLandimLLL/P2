import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Lista_Tarefas() {
  const [Notas, setNotas] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editando, setEditando] = useState(false);
  const [notaSendoEditada, setNotaSendoEditada] = useState(null);

  useEffect(() => {
    const carregarNotas = async () => {
      try {
        const notasSalvas = await AsyncStorage.getItem('@notas');
        if (notasSalvas) {
          setNotas(JSON.parse(notasSalvas));
        }
      } catch (error) {
        console.error('Erro ao carregar as notas:', error);
      }
    };

    carregarNotas();
  }, []);

  useEffect(() => {
    const salvarNotas = async () => {
      try {
        await AsyncStorage.setItem('@notas', JSON.stringify(Notas));
      } catch (error) {
        console.error('Erro ao salvar as notas:', error);
      }
    };

    salvarNotas();
  }, [Notas]);

  function adicionarNota() {
    if (inputValue !== '') {
      setNotas([...Notas, inputValue]);
      setNotaSendoEditada(null);
      setInputValue('');
    } else {
      console.warn('Digite algum valor');
    }
  }

  function editarNota() {
    let index = Notas.indexOf(notaSendoEditada);
    let novaLista = Notas.slice();

    novaLista.splice(index, 1, inputValue);

    setNotas(novaLista);
    setEditando(false);
    setInputValue('');
  }

  function excluirNota(nota) {
    let novaListaNotas = Notas.filter(item => item !== nota);
    setNotas(novaListaNotas);
  }

  function handleEditarNota(nota) {
    setNotaSendoEditada(nota);
    setInputValue(nota);
    setEditando(true);
  }

  function handleButton() {
    if (editando) {
      editarNota();
    } else {
      adicionarNota();
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={Notas}
        renderItem={({ item }) => (
          <Card style={styles.card} mode='outlined'>
            <Card.Content style={styles.cardContent}>
              <Text variant='titleMedium' style={{ flex: 1 }}>
                {item}
              </Text>
              <IconButton
                icon='lead-pencil'
                size={30}
                onPress={() => {
                  handleEditarNota(item);
                }}
              />
              <IconButton
                icon='delete-forever'
                size={30}
                onPress={() => {
                  excluirNota(item);
                }}
              />
            </Card.Content>
          </Card>
        )}
        ListHeaderComponent={
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              mode='outlined'
              label='Notas'
              value={inputValue}
              onChangeText={text => setInputValue(text)}
              multiline
              numberOfLines={40}
              textAlignVertical='top'
            />
            <Button
              mode='contained'
              onPress={handleButton}
              style={styles.addButton}
              labelStyle={{ color: '#000' }}
            >
              {editando ? 'Edit' : 'Add'}
            </Button>
          </View> }/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cyan',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 10,
    gap: 7,
    alignItems: 'center',
  },
  input: {
    flex: 4,
  },
  addButton: {
    width: 80,
    backgroundColor: '#ffd3b6',
    margin: 10,
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  list: {
    width: '95%',
    marginTop: 1,
  },
  card: {
    marginVertical: 10,
  },
  card_concluido: {
    marginVertical: 10,
    backgroundColor: '#baffc9',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
