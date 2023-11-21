import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Button, Card, FAB, Text } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function ListaAlunos({ navigation }) {

  const [alunos, setAlunos] = useState([]);
  
  useEffect(() => {
    loadAlunos();
  }, []);
  
  async function loadAlunos() {
    const response = await AsyncStorage.getItem('alunos');
    const alunosStorage = response ? JSON.parse(response) : [];
    setAlunos(alunosStorage);
  }
  
  
  async function adicionarAluno(aluno) {
    let novaListaAlunos = alunos;
    novaListaAlunos.push(aluno);
    await AsyncStorage.setItem('alunos', JSON.stringify(novaListaAlunos));
    setAlunos(novaListaAlunos);
  }
  
  async function editarAluno(alunoAntigo, novosDados) {
  
    const novaListaAlunos = alunos.map(aluno => {
      if (aluno === alunoAntigo) {
        return novosDados;
      } else {
        return aluno;
      }
    });
  
    await AsyncStorage.setItem('alunos', JSON.stringify(novaListaAlunos));
    setAlunos(novaListaAlunos);
  }
  
  async function excluirAluno(aluno) {
    const novaListaAlunos = alunos.filter(a => a !== aluno);
    await AsyncStorage.setItem('alunos', JSON.stringify(novaListaAlunos));
    setAlunos(novaListaAlunos);
    Toast.show({
      type: 'success',
      text1: 'Aluno excluído com sucesso!',
    });
  }
  return (
    <View style={styles.container}>
      <Text variant='titleLarge' style={styles.title} >Lista</Text>
      <FlatList
        style={styles.list}
        data={alunos}
        renderItem={({ item }) => (
          <Card
            mode='outlined'
            style={styles.card}>
              

            <Card.Content
              style={styles.cardContent}>

              <View style={{ flex: 1 }}>
                <Text variant='titleMedium'>{item?.nome}</Text>
                <Text variant='bodyLarge'>Matrícula: {item?.matricula}</Text>
                <Text variant='bodyLarge'>Turno: {item?.turno}</Text>
                <Text variant='bodyLarge'>Curso: {item.curso}</Text>
              </View>
            </Card.Content>

            <Card.Actions>
              <Button  
                onPress={() => navigation.push('FormAluno', { acao: editarAluno, aluno: item })}
                style={{ backgroundColor: 'red', borderWidth: 1.5, borderColor: 'black', marginRight: 10 }}>
                <Text style={{ color: 'white' }}>Editar</Text>
              </Button>
              <Button 
                onPress={() => excluirAluno(item)}
                style={{ backgroundColor: 'red', borderWidth: 1.5, borderColor: 'black' }}>
                <Text style={{ color: 'white' }}>Excluir</Text>
              </Button>
            </Card.Actions>
          </Card>)}/>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.push('FormAluno', { acao: adicionarAluno })}
      />
    </View>
  )
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
    margin: 10
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
    paddingBottom: 15
  }
})
