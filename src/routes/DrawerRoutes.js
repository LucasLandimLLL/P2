
import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import StackAlunos from '../screens/Livros/StackLivros';
import Notas from '../screens/inicial/Notas';
import Compras from '../screens/compras/compras';
import cartoes from '../screens/Cartoes/StackLivros'
import dia from '../screens/tarefasdiarias/tarefasdiarias'

const Drawer = createDrawerNavigator()

export default function DrawerRoutes() {
    return (
        <Drawer.Navigator initialRouteName='Alunos'>
            <Drawer.Screen name="Livros" component={StackAlunos} />
            <Drawer.Screen name='Notas' component={Notas}/>
            <Drawer.Screen name='Tarefas diarias' component={dia}/>
            <Drawer.Screen name='compras' component={Compras}/>
            <Drawer.Screen name='cartões' component={cartoes}/>

        </Drawer.Navigator>

    )
}