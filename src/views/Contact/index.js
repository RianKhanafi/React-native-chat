import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Icon,
  Card,
  Item,
  CardItem,
  Body,
  Button,
  Form,
  Input,
  Left,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {firebase} from '../../libs/config/firebase';
import {Header} from '../../component/header';
import {color} from '../../component/baseColor';
import {TouchableOpacity} from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Contact = (props) => {
  const [ContactList, setContactList] = useState([]);

  useEffect(() => {
    getContactList();
  }, [props]);

  const getContactList = async () => {
    let name = await AsyncStorage.getItem('name');

    try {
      const conn = firebase.database();
      const db = conn.ref('users/' + name + '/contact');

      db.on('value', (data) => {
        const result = [];

        data.forEach((el) => {
          result.push({
            _id: el.key,
            name: el.val().name,
            email: el.val().email,
          });
        });

        setContactList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const navigation = (url, name = null, email = null) => {
    if (name || email) {
      props.navigation.navigate(url, {
        name: name,
        email: email,
      });
    } else {
      props.navigation.navigate(url);
    }
  };

  return (
    <View style={styles.view}>
      <Header />
      <View style={styles.view.viewList}>
        <Form>
          <Item rounded style={styles.view.viewList.search}>
            <Icon
              type="EvilIcons"
              name="search"
              style={styles.view.viewList.search.icon}
            />
            <Input placeholder="Search Contact Here..." />
          </Item>
        </Form>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView>
            {ContactList.map((value, index) => {
              return (
                <TouchableOpacity
                  delayPressIn={1000}
                  key={index}
                  onPress={() => navigation('Room', value.name, value.email)}>
                  <Card
                    style={{
                      ...styles.view.viewList.card,
                      borderColor: index === 0 ? color.green : color.light,
                    }}>
                    <CardItem style={{...styles.view.viewList.cardItem}}>
                      <Left>
                        <Image
                          style={styles.view.viewList.cardItem.image}
                          source={{
                            uri:
                              'https://images.unsplash.com/photo-1578146059353-7bd5f5b644ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80',
                          }}
                        />
                        <Body style={styles.view.viewList.cardItem.body}>
                          <Text
                            style={styles.view.viewList.cardItem.body.textname}>
                            {value.name}
                          </Text>
                          <Text>{value.email}</Text>
                        </Body>
                      </Left>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </View>

      <Button
        primary
        rounded
        style={styles.addContact}
        onPress={() => navigation('AddNewContact')}>
        <Icon type="FontAwesome5" name="plus" style={styles.addContact.icon} />
      </Button>
    </View>
  );
};

const styles = {
  view: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: 'column',
    viewList: {
      paddingLeft: 28,
      paddingRight: 28,
      flex: 1,
      flexDirection: 'column',
      position: 'absolute',
      top: 30,
      width: windowWidth,
      search: {
        backgroundColor: color.light,
        borderWidth: 0,
        borderColor: color.light,
        marginBottom: 30,
        paddingLeft: 10,
        paddingRight: 10,
        icon: {
          color: color.green,
          fontSize: 25,
        },
      },
      card: {
        height: 50,
        elevation: 0,
        marginBottom: 30,
        borderRadius: 20,
        backgroundColor: color.light,
        borderColor: color.light,
      },
      cardItem: {
        padding: 0,
        margin: 0,
        borderRadius: 20,
        backgroundColor: color.light,
        borderColor: color.light,
        image: {
          height: 50,
          width: 50,
          borderRadius: 50,
        },
        body: {
          textname: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
      },
    },
  },
  addContact: {
    width: 50,
    height: 50,
    backgroundColor: color.green,
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: 20,
    marginBottom: 20,
    flex: 1,
    icon: {
      color: '#fff',
      fontSize: 20,
    },
  },
};
export default Contact;
