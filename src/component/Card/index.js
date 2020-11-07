import React from 'react';
import {View, Text, Image} from 'react-native';
import {Container, Card, CardItem, Left, Body} from 'native-base';
import {color} from '../baseColor';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const CardComponent = ({
  name = '',
  lastMessage = '',
  time = '',
  messageNotOpen = 0,
  isOnline = false,
  imgUrl = false,
  mainCard = false,
}) => {
  return (
    <Card style={{...styles.content.cardTop}}>
      <CardItem
        style={{
          backgroundColor: mainCard ? color.light : '#efefef',
          borderRadius: 20,
          marginTop: -5,
        }}>
        <Left>
          {imgUrl ? (
            <Image
              style={styles.content.cardTop.img}
              source={{
                uri: imgUrl,
              }}
            />
          ) : (
            <Icon name="user" style={styles.content.cardTop.img} />
          )}
          {isOnline && <View style={styles.content.cardTop.online}></View>}

          <Body>
            <View style={styles.content.cardTop.body}>
              <View style={styles.content.cardTop.body.leftContent}>
                <Text style={styles.content.cardTop.body.leftContent.name}>
                  {name}
                </Text>
                <Text note>{lastMessage}</Text>
              </View>

              <View style={styles.content.cardTop.body.rightContent}>
                <Text style={styles.content.cardTop.body.rightContent.time}>
                  {time}
                </Text>
                {messageNotOpen > 0 && (
                  <View
                    style={styles.content.cardTop.body.rightContent.newMessage}>
                    <Text
                      style={
                        styles.content.cardTop.body.rightContent.newMessage.text
                      }>
                      {messageNotOpen}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Body>
        </Left>
      </CardItem>
    </Card>
  );
};

const styles = {
  content: {
    cardTop: {
      height: 66,
      borderColor: 0,
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 20,
      online: {
        width: 10,
        height: 10,
        backgroundColor: color.green,
        position: 'absolute',
        bottom: 0,
        borderRadius: 20,
        marginLeft: 35,
      },
      img: {
        height: 50,
        width: 50,
        borderRadius: 50,
        fontSize: 50,
        color: '#cecece',
      },
      body: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        leftContent: {
          name: {
            fontWeight: 'bold',
          },
        },
        rightContent: {
          flex: 1,
          flexDirection: 'row',
          alignSelf: 'center',
          position: 'absolute',
          right: 0,
          time: {
            fontSize: 14,
          },
          newMessage: {
            width: 14,
            height: 14,
            backgroundColor: color.green,
            position: 'absolute',
            right: 0,
            marginTop: -12,
            borderRadius: 20,
            text: {
              fontSize: 9,
              color: 'white',
              textAlign: 'center',
            },
          },
        },
      },
    },
  },
};
