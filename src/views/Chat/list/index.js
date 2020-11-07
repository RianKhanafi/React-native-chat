import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Container,
  Card,
  CardItem,
  Left,
  Body,
  Thumbnail,
  Button,
} from 'native-base';
import {color} from '../../../component/baseColor';
import {CardComponent} from '../../../component';
import AsyncStorage from '@react-native-community/async-storage';
import {firebase} from '../../../libs/config/firebase';
import {convertTime} from '../../../libs/config/convertTime';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {useIsFocused} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';

const List = (props) => {
  const {navigation, stored} = props;
  const isFocused = useIsFocused();
  const [contactUser, setContactUser] = useState([]);

  useEffect(() => {
    getMessage();
  }, [, isFocused, props]);

  const getMessage = async () => {
    const name = await AsyncStorage.getItem('name');

    console.log(name);
    const db = firebase.database();

    try {
      // Get Contact
      const reference = db.ref('message/' + name);

      const result = [];

      reference.on('child_added', (data) => {
        let message = '';
        let time = '';
        let see = false;
        let seeCount = 0;
        data.forEach((el) => {
          message = el.val().message;
          time = el.val().time;
          see = el.val().see === 0;
          seeCount += el.val().see === 0 ? 1 : 0;
        });

        console.log(seeCount);

        db.ref('users/' + name + '/contact/' + data.key).on(
          'value',
          (usersData) => {
            result.push({
              email: usersData.val().email,
              name: usersData.val().name,
              message: message,
              time: time,
              see: see,
              seeCount: seeCount,
            });
          },
        );
      });

      console.log('result', result);
      setContactUser(result.sort(compare));
    } catch (error) {
      console.log(error);
    }
  };

  function compare(a, b) {
    if (a.time < b.time) {
      return 1;
    }
    if (a.time > b.time) {
      return -1;
    }
    return 0;
  }
  return (
    <View style={styles.container}>
      {/* <SafeAreaView>
        <ScrollView> */}

      {stored.displayName ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={contactUser}
          keyExtractor={(_, index) => 'key' + index}
          numColumns={1}
          renderItem={({item, index}) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              onPress={() =>
                navigation.navigate('Room', {
                  name: item.name,
                  email: item.email,
                })
              }>
              <CardComponent
                name={item.name}
                lastMessage={
                  item.message.length >= 22
                    ? item.message.slice(1, 24) + '...'
                    : item.message
                }
                time={convertTime(item.time)}
                messageNotOpen={item.see ? item.seeCount : 0}
                isOnline={true}
                mainCard={index === 0}
                imgUrl="https://images.unsplash.com/photo-1578146059353-7bd5f5b644ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80"
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.container.content}>
          <Card style={styles.container.content.card}>
            <CardItem style={styles.container.content.card.cardItem}>
              <Button
                transparent
                block
                onPress={() => navigation.navigate('ComplitedProfile')}>
                <Text style={styles.container.content.card.cardItem.text}>
                  Completed Your Profile {stored.displayName}
                </Text>
              </Button>
            </CardItem>
          </Card>
        </View>
      )}

      {/* </ScrollView>
      </SafeAreaView> */}
      {contactUser.length === 0 && (
        <View style={styles.container.noChat}>
          <Text style={styles.container.noChat.noChatTitle}>
            No message history
          </Text>
          <Button
            style={styles.container.noChat.startData.button}
            block
            onPress={() => onCheck()}>
            <Text style={styles.container.noChat.startData.button.text}>
              Start Your Chat
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default List;

const styles = {
  container: {
    paddingLeft: 28,
    paddingRight: 28,
    content: {
      card: {
        elevation: 0,
        borderColor: 0,
        marginTop: -85,
        height: 66,
        borderRadius: 20,
        backgroundColor: color.light,
        cardItem: {
          borderRadius: 20,
          backgroundColor: color.light,
          text: {
            textAlign: 'center',
          },
        },
      },
    },
    noChat: {
      width: windowWidth,
      height: windowHeight,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      startData: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        button: {
          backgroundColor: color.green,
          elevation: 0,
          marginLeft: 28,
          marginRight: 28,
          borderRadius: 20,
          text: {
            color: 'white',
          },
        },
      },

      noChatTitle: {
        fontWeight: 'bold',
        marginBottom: 20,
      },
    },
  },
};
