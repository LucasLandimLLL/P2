import { createStackNavigator } from '@react-navigation/stack'
import FormAluno from './FormAluno'
import ListaAlunos from './ListaAlunos'

const Stack = createStackNavigator()

export default function StackPessoas() {
    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaAlunos'
        >

            <Stack.Screen name='ListaAlunos' component={ListaAlunos} />

            <Stack.Screen name='FormAluno' component={FormAluno} />

        </Stack.Navigator>

    )
}
