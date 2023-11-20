import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListaCompras() {
  const [compras, setCompras] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editando, setEditando] = useState(false);
  const [compraSendoEditada, setCompraSendoEditada] = useState(null);
  const [comprasConcluidas, setComprasConcluidas] = useState([]);

  useEffect(() => {
    const carregarComprasSalvas = async () => {
      try {
        const comprasSalvas = await AsyncStorage.getItem('compras');
        if (comprasSalvas !== null) {
          setCompras(JSON.parse(comprasSalvas));
        }

        const comprasConcluidasSalvas = await AsyncStorage.getItem('comprasConcluidas');
        if (comprasConcluidasSalvas !== null) {
          setComprasConcluidas(JSON.parse(comprasConcluidasSalvas));
        }
      } catch (error) {
        console.error('Erro ao carregar compras do AsyncStorage:', error);
      }
    };

    carregarComprasSalvas();
  }, []);

  async function adicionarCompra() {
    if (inputValue !== '') {
      const novaLista = [...compras, inputValue];
      setCompras(novaLista);
      setCompraSendoEditada(null);
      setInputValue('');

      try {
        await AsyncStorage.setItem('compras', JSON.stringify(novaLista));
      } catch (error) {
        console.error('Erro ao salvar no AsyncStorage:', error);
      }
    } else {
      console.warn('Digite algum valor');
    }
  }

  function editarCompra() {
    let index = compras.indexOf(compraSendoEditada);
    let novaLista = compras;
    novaLista.splice(index, 1, inputValue);

    setCompras(novaLista);
    setEditando(false);
    setInputValue('');

    AsyncStorage.setItem('compras', JSON.stringify(novaLista)).catch((error) => {
      console.error('Erro ao salvar no AsyncStorage:', error);
    });
  }

  function excluirCompra(compra, lista) {
    let novaListaCompras = lista.filter((item) => item !== compra);
    return novaListaCompras;
  }

  function handleEditarCompra(compra) {
    setCompraSendoEditada(compra);
    setInputValue(compra);
    setEditando(true);
  }

  function handleConcluirCompra(compra) {
    let novaListaCompras = compras.filter((item) => item !== compra);
    setCompras(novaListaCompras);
    setComprasConcluidas([...comprasConcluidas, compra]);

    AsyncStorage.setItem('comprasConcluidas', JSON.stringify([...comprasConcluidas, compra])).catch(
      (error) => {
        console.error('Erro ao salvar no AsyncStorage:', error);
      }
    );

    AsyncStorage.setItem('compras', JSON.stringify(novaListaCompras)).catch((error) => {
      console.error('Erro ao salvar no AsyncStorage:', error);
    });
  }

  function excluirCompraConcluida(compra) {
    let novaListaComprasConcluidas = excluirCompra(compra, comprasConcluidas);
    setComprasConcluidas(novaListaComprasConcluidas);

    AsyncStorage.setItem('comprasConcluidas', JSON.stringify(novaListaComprasConcluidas)).catch(
      (error) => {
        console.error('Erro ao salvar no AsyncStorage:', error);
      }
    );
  }

  function handleButton() {
    if (editando) {
      editarCompra();
    } else {
      adicionarCompra();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={{ flex: 4 }}
          mode="outlined"
          label="Compras"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
        <Button
          mode="contained"
          onPress={handleButton}
          style={[styles.addButton, { backgroundColor: 'blue' }]}
        >
          {editando ? (
            <Text style={{ color: 'white' }}>Edit</Text>
          ) : (
            <Text style={{ color: 'white' }}>Add</Text>
          )}
        </Button>
      </View>

      <FlatList
        style={styles.list}
        data={compras}
        renderItem={({ item }) => (
          <Card style={styles.card} mode="outlined">
            <Card.Content style={styles.cardContent}>
              <Text variant="titleMedium" style={{ flex: 1 }}>
                {item}
              </Text>
              <IconButton
                icon="check-bold"
                size={30}
                onPress={() => {
                  handleConcluirCompra(item);
                }}
              />
              <IconButton
                icon="lead-pencil"
                size={30}
                onPress={() => {
                  handleEditarCompra(item);
                }}
              />
              <IconButton
                icon="delete-forever"
                size={30}
                onPress={() => {
                  setCompras(excluirCompra(item, compras));
                  AsyncStorage.setItem('compras', JSON.stringify(excluirCompra(item, compras))).catch(
                    (error) => {
                      console.error('Erro ao salvar no AsyncStorage:', error);
                    }
                  );
                }}
              />
            </Card.Content>
          </Card>
        )}
      />

      <Text style={[styles.lista, { color: 'black' }]}>Compras concluídas</Text>

      <FlatList
        style={styles.list}
        data={comprasConcluidas}
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
                  excluirCompraConcluida(item);
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
    backgroundColor: 'yellow',
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
