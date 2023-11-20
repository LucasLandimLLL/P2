import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import DrawerRoutes from './src/routes/DrawerRoutes';
import Toast from 'react-native-toast-message';
LogBox.ignoreLogs(['The action \'GO_BACK\' was not handled by any navigator.']);
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <DrawerRoutes />
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
}
