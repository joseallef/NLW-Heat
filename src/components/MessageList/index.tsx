import { api } from "../../service/api";
import io from 'socket.io-client';

import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";
import { useEffect, useState } from "react";

type Message = {
  id: string,
  text: string,
  user: {
    name: string,
    avatar_url: string,
  }  
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage);
})

export function MessageList() {
  const [messages, setMessage] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessage(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean)) // filter irá tirar faloress null ou underfined se caso aver

        messagesQueue.shift();
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessage(response.data);
    })
  }, []);
  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>

        {messages.map((message) => {
          return (   
            <li className={styles.message} key={message.id}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>{message.user.name}</span>
              </div>
            </li>
          );
          })}
      </ul>
    </div>
  );
}