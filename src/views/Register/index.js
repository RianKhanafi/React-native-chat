import React, {useEffect, useState} from 'react';
import {Text, Dimensions, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Form, Input, Item, Button} from 'native-base';
import {firebase} from '../../libs/config/firebase';
import {color} from '../../component/baseColor';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Header} from '../../component';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignIn = ({navigation}) => {
  const [userSignIn, setUserSignIn] = useState([]);
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    if (AsyncStorage.getItem('name')) {
      navigation.navigate('HomePage');
    }
  }, []);

  const handleChange = (value, name) => {
    setUserSignIn({
      ...userSignIn,
      [name]: value,
    });
  };

  const onSign = async () => {
    try {
      
      const resp = await firebase
        .auth()
        .signInWithEmailAndPassword(userSignIn.email, userSignIn.password);
      storeData(resp.user);

    } catch (error) {
      console.log(error);
    }
  };

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem('name', data.displayName);
      navigation.navigate('HomePage');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.view}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.content.title}>SIGN IN</Text>
        <Text style={styles.content.subtitle}>To Start Connection</Text>
        <View style={styles.content.form}>
          <Form>
            <Text style={styles.content.form.title}>Entry Your Email</Text>
            <Item regular style={styles.content.form.input}>
              <Input
                placeholder="Your email"
                onChangeText={(e) => handleChange(e, 'email')}
              />
            </Item>

            <Text style={styles.content.form.formTitletwo}>
              Entry Your Password
            </Text>

            <Item regular style={styles.content.form.input}>
              <Input
                secureTextEntry={showPassword}
                placeholder="Your password"
                onChangeText={(e) => handleChange(e, 'password')}
              />
              <Icon
                name={!showPassword ? 'eye' : 'eye-slash'}
                size={18}
                color="#000"
                light
                onPress={() => setShowPassword(!showPassword)}
              />
            </Item>
          </Form>
        </View>

        <Button light style={styles.content.button} block onPress={onSign}>
          <Text style={styles.content.button.text}>
            {' '}
            <Icon name="long-arrow-alt-right" size={30} />{' '}
          </Text>
        </Button>

        <Button
          transparent
          style={styles.footer}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footer.alredyhaveaccount}>
            Already have an account?
          </Text>
          <Text style={styles.footer.signin}>Sign Up</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = {
  view: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: 'column',
  },
  header: {
    width: '71%',
    height: '33%',
    backgroundColor: color.green,
    borderBottomRightRadius: 160,
    borderBottomLeftRadius: 160,
    borderTopRightRadius: 160,
    marginLeft: -70,
    marginTop: -70,
  },
  content: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 50,
    flex: 1,
    flexDirection: 'column',
    title: {
      fontSize: 40,
    },
    subtitle: {
      fontSize: 20,
    },

    form: {
      marginTop: 50,
      input: {
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        height: 60,
        backgroundColor: color.light,
        borderColor: color.light,
      },
      title: {
        marginBottom: 12,
      },
      formTitletwo: {
        marginTop: 25,
        marginBottom: 12,
      },
    },
    button: {
      marginTop: 40,
      backgroundColor: color.green,
      paddingLeft: 20,
      paddingRight: 20,
      width: 90,
      height: 50,
      elevation: 0,
      borderRadius: 50,
      text: {
        color: 'white',
        fontSize: 18,
      },
    },
  },
  footer: {
    marginTop: 50,
    fontSize: 12,
    flex: 1,
    flexDirection: 'row',
    alredyhaveaccount: {
      marginRight: 10,
    },
    signin: {
      color: color.green,
    },
  },
};

export default SignIn;
