import { StyleSheet, Text, View } from 'react-native'
import 'react-native-gesture-handler';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Notas from '../screens/inicial/Notas';
import StackAlunos from '../screens/Alunos/ListaAlunos'

const Drawer = createDrawerNavigator()

export default function DrawerRouter() {
  return (
    <NavigationContainer>
        <Drawer.Navigator initialRouteName="inicial">

            <Drawer.Screen name='Notas' component={Notas}/>
            <Drawer.Screen name="Alunos" component={StackAlunos} />

        </Drawer.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})