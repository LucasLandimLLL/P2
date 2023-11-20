import { createStackNavigator } from '@react-navigation/stack'
import FormLivros from '../Livros/FormLivros'
import ListaLivros from '../Livros/ListaLivros'

const Stack = createStackNavigator()

export default function StackPessoas() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaLivros' 
        >
            <Stack.Screen name='ListaLivros' component={ListaLivros} /> 
            <Stack.Screen name='FormLivros' component={FormLivros} />
        </Stack.Navigator>
    )
}
