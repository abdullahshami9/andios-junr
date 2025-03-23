import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  LockScreen: undefined;
};

export type NavigationProps = {
  navigation: StackNavigationProp<RootStackParamList>;
}; 