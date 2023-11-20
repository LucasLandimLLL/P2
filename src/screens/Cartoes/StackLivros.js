import { createStackNavigator } from '@react-navigation/stack'
import FormCartoes from '../Cartoes/Formcartoes'
import ListaCartoes from '../Cartoes/Listacartoes'

const Stack = createStackNavigator()

export default function StackPessoas() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='Listacartoes' 
        >
            <Stack.Screen name='Listacartoes' component={ListaCartoes} /> 
            <Stack.Screen name="FormCartoes" component={FormCartoes} />
        </Stack.Navigator>
    )
}
