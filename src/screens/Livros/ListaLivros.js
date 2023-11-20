import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ListaLivros() {
  const navigation = useNavigation();
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    async function carregarLivros() {
      try {
        const livrosSalvos = await AsyncStorage.getItem('livros');
        if (livrosSalvos) {
          setLivros(JSON.parse(livrosSalvos));
        }
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      }
    }

    carregarLivros();
  }, []);

  async function adicionarLivro(livroNovo) {
    const novaListaLivros = [...livros, livroNovo];

    await AsyncStorage.setItem('livros', JSON.stringify(novaListaLivros));
    setLivros(novaListaLivros);
    Toast.show({
      type: 'success',
      text1: 'Livro adicionado com sucesso!',
    });
  }

  async function excluirLivro(livro) {
    const novaListaLivros = livros.filter((livroItem) => livroItem !== livro);

    await AsyncStorage.setItem('livros', JSON.stringify(novaListaLivros));
    setLivros(novaListaLivros);
    Toast.show({
      type: 'success',
      text1: 'Livro excluído com sucesso!',
    });
  }

  async function editarLivro(livroAntigo, livroNovo) {
    const novaListaLivros = livros.map((livro) =>
      livro === livroAntigo ? { ...livro, ...livroNovo } : livro
    );

    await AsyncStorage.setItem('livros', JSON.stringify(novaListaLivros));
    setLivros(novaListaLivros);
    Toast.show({
      type: 'success',
      text1: 'Livro editado com sucesso!',
    });
    navigation.goBack(); 
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Lista de Livros
      </Text>
      <FlatList
        style={styles.list}
        data={livros}
        renderItem={({ item }) => (
          <Card mode="outlined" style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium">Livro: {item?.nome}</Text>
                <Text variant="bodyLarge">Pagina: {item?.matricula }</Text>
                <Text variant="bodyLarge">Autor: {item?.turno }</Text>
                <Text variant="bodyLarge">Comentario: {item?.curso }</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.push('FormLivros', {
                    acao: (livroAntigo, livroNovo) => editarLivro(item, livroAntigo, livroNovo),
                  })
                }>
                Editar
              </Button>
              <Button onPress={() => excluirLivro(item)}>Excluir</Button>
            </Card.Actions>
          </Card>
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.push('FormLivros', { acao: adicionarLivro })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    margin: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    backgroundColor: 'red',
  },
  list: {
    width: '90%',
  },
  card: {
    marginTop: 15,
  },
  cardContent: {
    flexDirection: 'row',
    backgroundColor: '#d3d3d3',
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 15,
  },
});
