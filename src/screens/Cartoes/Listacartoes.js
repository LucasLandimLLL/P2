import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


export default function ListaCartoes() {
  const navigation = useNavigation();
  const [cartoes, setCartoes] = useState([]);

  useEffect(() => {
    async function carregarCartoes() {
      try {
        const cartoesSalvos = await AsyncStorage.getItem('cartoes');
        if (cartoesSalvos) {
          setCartoes(JSON.parse(cartoesSalvos));
        }
      } catch (error) {
        console.error('Erro ao carregar cartões:', error);
      }
    }

    carregarCartoes();
  }, []);

  async function adicionarCartao(cartaoNovo) {
    const novaListaCartoes = [...cartoes, cartaoNovo];

    await AsyncStorage.setItem('cartoes', JSON.stringify(novaListaCartoes));
    setCartoes(novaListaCartoes);
    Toast.show({
      type: 'success',
      text1: 'Cartão adicionado com sucesso!',
    });
  }

  async function excluirCartao(cartao) {
    const novaListaCartoes = cartoes.filter((cartaoItem) => cartaoItem !== cartao);

    await AsyncStorage.setItem('cartoes', JSON.stringify(novaListaCartoes));
    setCartoes(novaListaCartoes);
    Toast.show({
      type: 'success',
      text1: 'Cartão excluído com sucesso!',
    });
  }

  async function editarCartao(cartaoAntigo, cartaoNovo) {
    const novaListaCartoes = cartoes.map((cartao) =>
      cartao === cartaoAntigo ? { ...cartao, ...cartaoNovo } : cartao
    );

    await AsyncStorage.setItem('cartoes', JSON.stringify(novaListaCartoes));
    setCartoes(novaListaCartoes);
    Toast.show({
      type: 'success',
      text1: 'Cartão editado com sucesso!',
    });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Lista de Cartões
      </Text>
      <FlatList
        style={styles.list}
        data={cartoes}
        renderItem={({ item }) => (
          <Card mode="outlined" style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium">Número do Cartão: {item?.numeroCartao}</Text>
                <Text variant="bodyLarge">CVV: {item?.cvv}</Text>
                <Text variant="bodyLarge">Validade: {item?.validade}</Text>
                <Text variant="bodyLarge">CPF: {item?.cpf}</Text>
                <Text variant="bodyLarge">Nome Completo: {item?.nomeCompleto}</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.push('FormCartoes', {
                    acao: (cartaoAntigo, cartaoNovo) => editarCartao(item, cartaoAntigo, cartaoNovo),
                  })
                }>
                Editar
              </Button>
              <Button onPress={() => excluirCartao(item)}>Excluir</Button>
            </Card.Actions>
          </Card>
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.push('FormCartoes', { acao: adicionarCartao })}
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
    backgroundColor: '#38FF00',
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
    backgroundColor: 'purple',
  },
  list: {
    width: '90%',
  },
  card: {
    marginTop: 15,
  },
  cardContent: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 15,
  },
});

