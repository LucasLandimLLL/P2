import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';

export default function FormCartao({ route }) {
  const navigation = useNavigation();
  const { acao, cartao: cartaoAntigo } = route.params;

  const [numeroCartao, setNumeroCartao] = useState('');
  const [cvv, setCvv] = useState('');
  const [validade, setValidade] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [showMensagemErro, setShowMensagemErro] = useState(false);

  useEffect(() => {
    if (cartaoAntigo) {
      setNumeroCartao(cartaoAntigo.numeroCartao);
      setCvv(cartaoAntigo.cvv);
      setValidade(cartaoAntigo.validade);
      setCpf(cartaoAntigo.cpf);
      setNomeCompleto(cartaoAntigo.nomeCompleto);
    }
  }, [cartaoAntigo]);

  function salvar() {
    if (
      numeroCartao === '' ||
      cvv === '' ||
      validade === '' ||
      cpf === '' ||
      nomeCompleto === ''
    ) {
      setShowMensagemErro(true);
    } else {
      setShowMensagemErro(false);

      const cartaoNovo = {
        numeroCartao: numeroCartao,
        cvv: cvv,
        validade: validade,
        cpf: cpf,
        nomeCompleto: nomeCompleto,
      };

      if (cartaoAntigo) {
        acao(cartaoAntigo, cartaoNovo);
      } else {
        acao(cartaoNovo);
      }

      Toast.show({
        type: 'success',
        text1: 'Cartão salvo com sucesso!',
      });

      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {cartaoAntigo ? 'Editar Cartão' : 'Adicionar Cartão'}
      </Text>
      <Card style={styles.card}>
        <Card.Content>
          <TextInputMask
            style={styles.input}
            type={'credit-card'}
            options={{
              obfuscated: false,
              issuer: 'visa-or-mastercard',
            }}
            keyboardType="numeric"
            placeholder={'Número do cartão'}
            value={numeroCartao}
            onChangeText={(text) => setNumeroCartao(text)}
          />
          <TextInputMask
            style={styles.input}
            type={'custom'}
            options={{
              mask: '999',
            }}
            keyboardType="numeric"
            placeholder={'CVV'}
            value={cvv}
            onChangeText={(text) => setCvv(text)}
          />
          <TextInputMask
            style={styles.input}
            type={'custom'}
            options={{ mask: '99/99' }}
            keyboardType="numeric"
            placeholder={'Validade'}
            value={validade}
            onChangeText={(text) => setValidade(text)}
          />
          <TextInputMask
            style={styles.input}
            type={'cpf'}
            placeholder={'CPF'}
            value={cpf}
            onChangeText={(text) => setCpf(text)}
          />
          <TextInput
            style={styles.input}
            label={'Nome Completo'}
            mode="outlined"
            value={nomeCompleto}
            onChangeText={(text) => setNomeCompleto(text)}
          />
        </Card.Content>
      </Card>
      {showMensagemErro && (
        <Text style={{ color: 'red', textAlign: 'center' }}>Preencha todos os campos!</Text>
      )}
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
    backgroundColor: '#38FF00',
  },
  title: {
    fontWeight: 'bold',
    margin: 10,
  },
  card: {
    width: '90%',
    marginBottom: 60,
  },
  input: {
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginBottom: 30,
  },
  button: {
    flex: 1,
  },
});
