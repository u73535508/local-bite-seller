import React, { useState, useEffect, useRef } from "react";
import { Button, ConfigProvider, Input, List, Spin } from "antd";

const { TextArea } = Input;

const ChatBox = ({ visible, onClose }) => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null); // Referans ekleyelim
  const lastMessageRef = useRef(null);

  const questionsAnswers = [
    {
      question: "Türkiye'de enginar nasıl üretilir?",
      answer:
        "Türkiye'de enginar, genellikle Antalya, Alanya, Side, Kaş, Fethiye gibi bölgelerde yetiştirilmektedir. Bu bölgelerdeki enginar bahçeleri, özel olarak hazırlanan topraklarda ve uygun iklim koşullarında yetiştirilir. Enginar, genellikle ilkbahar aylarında hasat edilir ve taze olarak tüketilir. Ancak bazı durumlarda, kış mevsiminde de depolama yöntemleriyle saklanabilir.",
    },
    {
      question: "Türkiye'de zeytin üretim adımları nelerdir?",
      answer:
        "Türkiye'de zeytin üretimi, zeytin ağaçlarının dikimi, bakımı, hasadı, işlenmesi, paketlenmesi ve pazarlanması gibi birçok adımı içerir. Zeytin ağacının dikimi, genellikle sonbahar aylarında yapılır ve ağaçlar 2-3 yıl boyunca bakım gerektirir. Hasada kadar geçen süre zarfında zeytinler olgunlaşır ve hasat zamanı geldiğinde zeytinler toplanarak işlenmek üzere fabrikalara gönderilir. Zeytinler fabrikalarda işlenerek çeşitli ürünler haline getirilir ve daha sonra paketlenerek piyasaya sunulur.",
    },
    {
      question: "Türkiye'de üzüm nasıl yetiştirilir?",
      answer:
        "Türkiye, dünya genelinde en çok üzüm üreten ülkelerden biridir. Ülkenin farklı bölgelerinde farklı üzüm çeşitleri yetiştirilebilmektedir. En yaygın olarak yetiştirilen üzüm türleri arasında Şıra, Narince, Boğazkere, Merlot, Cabernet Sauvignon, Syrah, Chardonnay ve Sauvignon Blanc gibi çeşitler yer almaktadır. Bu üzümler, genellikle şarap üretiminde kullanılırken, bazı bölgelerimizde de meyve suyu veya tatlı olarak da tüketilir.",
    },
    {
      question: "Türkiye'de peynir nasıl üretilir?",
      answer:
        "Türkiye'de, genellikle inek veya koyun sütünden yapılan peynirler üretilir. Süt, pastörize edilir ve peynir altı suyu elde etmek için süzülür. Peynir altı suyu daha sonra peynir mayası ile karıştırılır ve peynir mayasının fermantasyonuyla peynir yapılır.",
    },
  ];
  useEffect(() => {
    console.log("chatContainerRef", chatContainerRef.current);
    // Her mesaj eklediğimizde, mesaj listesinin en altına scroll etmek için kullanılır
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // messages değiştiğinde bu useEffect'i tetikler

  const handleSendMessage = async (question) => {
    setLoading(true);
    const answer = questionsAnswers.find(
      (qa) => qa.question === question
    )?.answer;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setMessages([
      ...messages,
      { text: question, isBot: false },
      {
        text: answer ? answer : "Üzgünüm, bu sorunun cevabını bilmiyorum.",
        isBot: true,
      },
    ]);

    setLoading(false);
    setUserMessage("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        width: 500,
        right: 16,

        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        display: visible ? "block" : "none",
      }}
      ref={chatContainerRef} // Referansı ekleyelim
    >
      <ConfigProvider
        theme={{
          components: {
            Input: {
              colorBorder: "#E9AA53",
              hoverBorderColor: "#F0CA95",
              activeBorderColor: "#F0CA95",
              colorSuccessBg: "#F0CA95",
              colorSuccessBgHover: "red",
            },
            TextArea: {
              colorBorder: "#E9AA53",
              hoverBorderColor: "#F0CA95",
              activeBorderColor: "#F0CA95",
              colorSuccessBg: "#F0CA95",
              colorSuccessBgHover: "red",
            },
            Button: {
              colorPrimary: "#E9AA53",
              colorPrimaryHover: "#ECB76C",
            },
            Checkbox: {
              colorPrimary: "#E9AA53",
              colorPrimaryHover: "#F0CA95",
            },
          },
        }}
      >
        <List
          style={{
            maxHeight: "250px",
            overflowY: "auto",
            marginBottom: "16px",
          }}
          dataSource={messages}
          renderItem={(item, index) => (
            <List.Item
              style={{
                textAlign: item.isBot ? "left" : "right",
                display: "flex",
                justifyContent: item.isBot ? "flex-start" : "flex-end",
              }}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              {item.isBot && ( // Eğer mesaj bot tarafından gönderilmişse
                <div style={{ marginRight: "8px" }}>
                  {" "}
                  {/* Araya boşluk eklemek için */}
                  <img
                    src="https://png.pngtree.com/png-vector/20240130/ourlarge/pngtree-cute-cartoon-farmer-character-generative-ai-png-image_11568944.png"
                    alt="AI Avatar"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  background: item.isBot ? "#f0f0f0" : "#e6f7ff",
                }}
              >
                {item.text}
              </div>
            </List.Item>
          )}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextArea
            value={userMessage}
            placeholder="Type your message..."
            autoSize={{ minRows: 2 }}
            onChange={(e) => setUserMessage(e.target.value)}
            style={{ marginRight: "8px" }} // TextArea'nın sağında bir boşluk bırakmak için
          />
          {loading && (
            <div style={{ textAlign: "center" }}>
              <ConfigProvider
                theme={{
                  components: {
                    Spin: {
                      colorPrimary: "#F0CA95",
                    },
                  },
                }}
              >
                <Spin size="large" />
              </ConfigProvider>
            </div>
          )}
        </div>

        <Button
          type="primary"
          onClick={() => handleSendMessage(userMessage)}
          loading={loading}
          disabled={!userMessage}
        >
          Send
        </Button>

        <Button type="default" style={{ marginTop: "8px" }} onClick={onClose}>
          Close
        </Button>
      </ConfigProvider>
    </div>
  );
};

export default ChatBox;
