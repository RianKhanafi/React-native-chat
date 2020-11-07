import React, { useEffect, useState } from 'react';
import { Text, Dimensions, View, StyleSheet } from 'react-native';
import { Form, Input, Item, Button } from 'native-base';
import { firebase } from '../../../libs/config/firebase';
import { color } from '../../../component/baseColor';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

import { Header } from '../../../component';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ComplitedProfile = ({ navigation }) => {
  const [userUpdate, setUserUpdate] = useState({
    displayName: '',
    email: '',
  });
  
  const [showPassword, setShowPassword] = useState(true);

  const handleChange = (value, name) => {
    setUserUpdate({
      ...userUpdate,
      [name]: value,
    });
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const resp = await firebase.auth().currentUser;
 
      setUserUpdate({
        displayName: resp.displayName,
        email: resp.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async () => {
    try {
      console.log(userUpdate.email);
      await firebase
        .auth()
        .currentUser.updateProfile( {displayName: userUpdate.displayName});
      await firebase.auth().currentUser.updateEmail(userUpdate.email);
      storeData(userUpdate.displayName);
      navigation.navigate('HomePage');
    } catch (error) {
      console.log(error);
    }
  };

  const storeData = async (name) => {
    try {
      await AsyncStorage.setItem('displayName', name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.view}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.content.subtitle}>Completed your Profile</Text>
        <View style={styles.content.form}>
          <Form>
            <Text style={styles.content.form.title}>Entry Your Name</Text>
            <Item regular style={styles.content.form.input}>
              <Input
                placeholder="Your name"
                value={userUpdate.displayName}
                onChangeText={(e) => handleChange(e, 'displayName')}
              />
            </Item>

            <Text style={styles.content.form.formTitletwo}>
              Entry Your New Email
            </Text>
            <Item regular style={styles.content.form.input}>
              <Input
                placeholder="Your email"
                value={userUpdate.email}
                onChangeText={(e) => handleChange(e, 'email')}
              />
            </Item>
          </Form>
        </View>

        <Button light style={styles.content.button} block onPress={onUpdate}>
          <Text style={styles.content.button.text}>
            <Icon name="save" size={30} />
          </Text>
        </Button>

        <Button
          transparent
          style={styles.footer}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footer.signin}>Skip this step</Text>
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
      color: 'black',
    },
  },
};

export default ComplitedProfile;
