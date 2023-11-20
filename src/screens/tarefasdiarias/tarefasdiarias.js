import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeout from 'react-native-swipeout';
import ViewPropTypes from 'deprecated-react-native-prop-types';

export default function Lista_Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editando, setEditando] = useState(false);
  const [tarefaSendoEditada, setTarefaSendoEditada] = useState(null);
  const [tarefasConcluidas, setTarefasConcluidas] = useState([]);

  useEffect(() => {
    const carregarTarefasSalvas = async () => {
      try {
        const tarefasSalvas = await AsyncStorage.getItem('tarefas');
        if (tarefasSalvas !== null) {
          setTarefas(JSON.parse(tarefasSalvas));
        }

        const tarefasConcluidasSalvas = await AsyncStorage.getItem('tarefasConcluidas');
        if (tarefasConcluidasSalvas !== null) {
          setTarefasConcluidas(JSON.parse(tarefasConcluidasSalvas));
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas do AsyncStorage:', error);
      }
    };

    carregarTarefasSalvas();
  }, []);

  async function adicionarTarefa() {
    if (inputValue !== '') {
      const novaLista = [...tarefas, inputValue];
      setTarefas(novaLista);
      setTarefaSendoEditada(null);
      setInputValue('');

      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(novaLista));
      } catch (error) {
        console.error('Erro ao salvar no AsyncStorage:', error);
      }
    } else {
      console.warn('Digite algum valor');
    }
  }

  function editarTarefa() {
    let index = tarefas.indexOf(tarefaSendoEditada);
    let novaLista = tarefas;
    novaLista.splice(index, 1, inputValue);

    setTarefas(novaLista);
    setEditando(false);
    setInputValue('');

    AsyncStorage.setItem('tarefas', JSON.stringify(novaLista)).catch((error) => {
      console.error('Erro ao salvar no AsyncStorage:', error);
    });
  }

  function excluirTarefa(tarefa, lista) {
    let novaListaTarefas = lista.filter((item) => item !== tarefa);
    return novaListaTarefas;
  }

  function handleEditarTarefa(tarefa) {
    setTarefaSendoEditada(tarefa);
    setInputValue(tarefa);
    setEditando(true);
  }

  function handleConcluirTarefa(tarefa) {
    let novaListaTarefas = tarefas.filter((item) => item !== tarefa);
    setTarefas(novaListaTarefas);
    setTarefasConcluidas([...tarefasConcluidas, tarefa]);

    AsyncStorage.setItem('tarefasConcluidas', JSON.stringify([...tarefasConcluidas, tarefa])).catch(
      (error) => {
        console.error('Erro ao salvar no AsyncStorage:', error);
      }
    );

    AsyncStorage.setItem('tarefas', JSON.stringify(novaListaTarefas)).catch((error) => {
      console.error('Erro ao salvar no AsyncStorage:', error);
    });
  }

  function excluirTarefaConcluida(tarefa) {
    let novaListaTarefasConcluidas = excluirTarefa(tarefa, tarefasConcluidas);
    setTarefasConcluidas(novaListaTarefasConcluidas);

    AsyncStorage.setItem('tarefasConcluidas', JSON.stringify(novaListaTarefasConcluidas)).catch(
      (error) => {
        console.error('Erro ao salvar no AsyncStorage:', error);
      }
    );
  }

  function handleButton() {
    if (editando) {
      editarTarefa();
    } else {
      adicionarTarefa();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={{ flex: 4 }}
          mode="outlined"
          label="tarefas diárias"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
        <Button
          mode="contained"
          onPress={handleButton}
          style={[styles.addButton, { backgroundColor: 'yellow' }]}
        >
          {editando ? (
            <Text style={{ color: 'black' }}>Edit</Text>
          ) : (
            <Text style={{ color: 'black' }}>Add</Text>
          )}
        </Button>
      </View>

      <FlatList
        style={styles.list}
        data={tarefas}
        renderItem={({ item }) => (
          <Swipeout
            right={[
              {
                text: 'Concluir',
                backgroundColor: 'green',
                onPress: () => handleConcluirTarefa(item),
              },
              {
                text: 'Editar',
                backgroundColor: 'blue',
                onPress: () => handleEditarTarefa(item),
              },
              {
                text: 'Excluir',
                backgroundColor: 'red',
                onPress: () => {
                  setTarefas(excluirTarefa(item, tarefas));
                  AsyncStorage.setItem('tarefas', JSON.stringify(excluirTarefa(item, tarefas))).catch(
                    (error) => {
                      console.error('Erro ao salvar no AsyncStorage:', error);
                    }
                  );
                },
              },
            ]}
            autoClose={true}
            backgroundColor="transparent"
            ViewPropTypes={ViewPropTypes}
          >
            <Card style={styles.card} mode="outlined">
              <Card.Content style={styles.cardContent}>
                <Text variant="titleMedium" style={{ flex: 1 }}>
                  {item}
                </Text>
              </Card.Content>
            </Card>
          </Swipeout>
        )}
      />

      <Text style={[styles.lista, { color: 'white' }]}>Tarefas concluídas</Text>

      <FlatList
        style={styles.list}
        data={tarefasConcluidas}
        renderItem={({ item }) => (
          <Card style={styles.card_concluido} mode="outlined">
            <Card.Content style={styles.cardContent}>
              <Text variant="titleMedium" style={{ flex: 1 }}>
                {item}
              </Text>
              <IconButton
                icon="delete-forever"
                size={30}
                onPress={() => {
                  excluirTarefaConcluida(item);
                }}
              />
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '95%',
    paddingTop: 10,
    gap: 5,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffd3b6',
    textColor: '#000',
  },
  list: {
    width: '95%',
    marginTop: 10,
  },
  card: {
    margin: 5,
  },
  card_concluido: {
    margin: 5,
    backgroundColor: '#baffc9',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 80,
    margin: 10,
    justifyContent: 'center',
  },
  lista: {
    marginTop: 10,
    fontSize: 20,
  },
});
