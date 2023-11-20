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

  const [errors, setErrors] = useState({
    numeroCartao: '',
    cvv: '',
    validade: '',
    cpf: '',
  });

  useEffect(() => {
    if (cartaoAntigo) {
      setNumeroCartao(cartaoAntigo.numeroCartao || '');
      setCvv(cartaoAntigo.cvv || '');
      setValidade(cartaoAntigo.validade || '');
      setCpf(cartaoAntigo.cpf || '');
      setNomeCompleto(cartaoAntigo.nomeCompleto || '');
    }
  }, [cartaoAntigo]);

  function validarNumeroCartao(numeroCartao) {
    const regex = /^[0-9]{4} ?[0-9]{4} ?[0-9]{4} ?[0-9]{4}$/;
    return regex.test(numeroCartao);
  }

  function validarCVV(cvv) {
    const regex = /^[0-9]{3}$/;
    return regex.test(cvv);
  }

  function validarValidade(validade) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(validade);
  }

  function validarCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    return regex.test(cpf);
  }

  async function salvar() {
    const errorsCopy = { ...errors };
    errorsCopy.numeroCartao = validarNumeroCartao(numeroCartao) ? '' : 'Número de cartão inválido';
    errorsCopy.cvv = validarCVV(cvv) ? '' : 'CVV inválido';
    errorsCopy.validade = validarValidade(validade) ? '' : 'Data de validade inválida';
    errorsCopy.cpf = validarCPF(cpf) ? '' : 'CPF inválido';

    setErrors(errorsCopy);

    const hasErrors = Object.values(errorsCopy).some((error) => error !== '');

    if (hasErrors) {
      setShowMensagemErro(true);
      return;
    }

    setShowMensagemErro(false);

    try {
      if (cartaoAntigo) {
        await acao(cartaoAntigo.id, {
          numeroCartao,
          cvv,
          validade,
          cpf,
          nomeCompleto,
        });

        Toast.show({
          type: 'success',
          text1: 'Cartão editado com sucesso!',
        });
      } else {
        await acao({
          numeroCartao,
          cvv,
          validade,
          cpf,
          nomeCompleto,
        });

        Toast.show({
          type: 'success',
          text1: 'Cartão adicionado com sucesso!',
        });
      }

      
      navigation.navigate('Listacartoes');  
    } catch (error) {
      console.error('Erro ao realizar ação:', error);
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
          {errors.numeroCartao !== '' && (
            <Text style={{ color: 'red' }}>{errors.numeroCartao}</Text>
          )}
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
          {errors.cvv !== '' && <Text style={{ color: 'red' }}>{errors.cvv}</Text>}
          <TextInputMask
            style={styles.input}
            type={'custom'}
            options={{ mask: '99/99' }}
            keyboardType="numeric"
            placeholder={'Validade'}
            value={validade}
            onChangeText={(text) => setValidade(text)}
          />
          {errors.validade !== '' && (
            <Text style={{ color: 'red' }}>{errors.validade}</Text>
          )}
          <TextInputMask
            style={styles.input}
            type={'cpf'}
            placeholder={'CPF'}
            value={cpf}
            onChangeText={(text) => setCpf(text)}
          />
          {errors.cpf !== '' && <Text style={{ color: 'red' }}>{errors.cpf}</Text>}
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
