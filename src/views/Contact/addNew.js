import React, {useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {Form, Item, Input, Button} from 'native-base';
import {Header} from '../../component';
import {firebase} from '../../libs/config/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {color} from '../../component/baseColor';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddNewContact = ({navigation}) => {
  const [newContact, setNewContact] = useState([]);

  const onChangeInput = (value, name) => {
    setNewContact({
      ...newContact,
      [name]: value,
    });
  };

  const handleAddNewContact = async () => {
    let name = await AsyncStorage.getItem('name');

    try {
      const db = firebase.database();
      const reference = db.ref('users');
      let contact = {};
      let msgId = reference.child(name).child('/contact/').push().key;

      contact[name + '/contact/' + newContact.name] = {
        email: newContact.email,
        name: newContact.name,
      };

      reference.update(contact);

      navigation.navigate('Contact');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.view}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.content.title}>Add New</Text>
        <Text style={styles.content.subtitle}>More connections</Text>
        <Form style={styles.content.form}>
          <Text style={styles.content.email}>User Contact Email</Text>
          <Item style={styles.content.form.input} last>
            <Input
              placeholder="Entry Email"
              onChangeText={(e) => onChangeInput(e, 'email')}
            />
          </Item>

          <Text style={styles.content.name}>User Contact Name</Text>
          <Item style={styles.content.form.input} last>
            <Input
              placeholder="Entry Name"
              onChangeText={(e) => onChangeInput(e, 'name')}
            />
          </Item>
        </Form>

        <Button
          onPress={handleAddNewContact}
          block
          style={styles.content.addNew}>
          <Text style={styles.content.addNew.text}>Add New Contact</Text>
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
      fontSize: 22,
    },
    email: {
      marginBottom: 10,
    },
    name: {
      marginBottom: 10,
    },
    form: {
      marginTop: 35,
      input: {
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        height: 60,
        backgroundColor: color.light,
        borderColor: color.light,
        marginBottom: 30,
      },
      title: {
        marginBottom: 12,
      },
      formTitletwo: {
        marginTop: 25,
        marginBottom: 12,
      },
    },
    addNew: {
      marginTop: 50,
      backgroundColor: color.green,
      elevation: 0,
      borderRadius: 50,
      text: {
        color: '#ffff',
      },
    },
  },
};

export default AddNewContact;
