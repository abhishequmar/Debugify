import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const {
    selectedChat,
    setSelectedChat,
    user,
    myChats,
    setMyChats,
    allChats,
    setAllChats,
  } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config); //ALl chats Data

      const new_data = [];
      const allc = [];
      data.map((d) => {
        d.users.map((ui) => {
          if (ui._id == user._id) {
            new_data.push(d);
          } else {
            allc.push(d);
          }
        });
      });
      console.log(allc); // Personal Chats Data

      setMyChats(new_data);
      setAllChats(allc);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#2A263B"
      w={{ base: "100%", md: "31%" }}
      // h="50%"
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* My Doubts text and button */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="white"
      >
        My Doubts
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg="#1D1E1E"
          >
            Create Doubt
          </Button>
        </GroupChatModal>
      </Box>

      {/* My Doubts scroll */}
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#1D1E1E"
        w="100%"
        h="50%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {myChats ? (
          <Stack overflowY="scroll" bg="#1D1E1E" border={1}>
            {myChats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#262829"}
                color="white"
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {chat.chatName}
                  {/* {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName} */}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>

      {/* All doubts heading */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="white"
      >
        All Doubts
      </Box>
      {/* All doubts scroll section */}
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#1D1E1E"
        w="100%"
        h="50%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {allChats ? (
          <Stack overflowY="scroll" bg="#1D1E1E">
            {allChats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#262829"}
                color="white"
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {chat.chatName}
                  {/* {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName} */}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
