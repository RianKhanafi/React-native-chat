import React, { useEffect, useState } from 'react';
import { Text, Dimensions, View } from 'react-native';
import { Form, Input, Item, Button } from 'native-base';
import { firebase } from '../../libs/config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from '../../component/baseColor';

import { Header } from '../../component';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Register = ({ navigation }) => {
  const [userSignUp, setUserSignUp] = useState([]);

  const handleChange = (value, name) => {
    setUserSignUp({
      ...userSignUp,
      [name]: value,
    });
  };

  const onSave = async () => {
    try {
      const resp = await firebase
        .auth()
        .createUserWithEmailAndPassword(userSignUp.email, userSignUp.password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.view}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.content.title}>SIGN UP</Text>
        <Text style={styles.content.subtitle}>To Start Connection</Text>

        <View style={styles.content.form}>
          <Form>
            <Text style={styles.content.form.title}>Enter Your Email</Text>
            <Item regular style={styles.content.form.input}>
              <Input
                placeholder="Your Email"
                onChangeText={(e) => handleChange(e, 'email')}
              />
            </Item>

            <Text style={styles.content.form.formTitletwo}>
              Enter Your Password
            </Text>
            <Item regular style={styles.content.form.input}>
              <Input
                placeholder="Your Password"
                onChangeText={(e) => handleChange(e, 'password')}
              />
            </Item>
          </Form>
        </View>

        <Button light style={styles.content.button} block onPress={onSave}>
          <Text style={styles.content.button.text}>
            {' '}
            <Icon name="long-arrow-alt-right" size={30} />{' '}
          </Text>
        </Button>

        <Button
          transparent
          style={styles.footer}
          onPress={() => navigation.navigate('Signip')}>
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
    backgroundColor: '#35A471',
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
        height: 60,
        backgroundColor: '#ebebeb',
        borderColor: '#ebebeb',
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
      marginTop: 45,
      backgroundColor: '#35A471',
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

export default Register;
