import type { NextPage } from "next";
import Page from "../components/Page";

const Home: NextPage = ({ user,setUser }: any) => {
  return (
    <Page>
      <p>{user.username}</p>
      <a href="/login">Login</a>
      <button onClick={() =>setUser({username:"hii"})}>ttest</button>
    </Page>
  );
  /*const [loc, setLoc] = useState([0, 0]);
  const router = useRouter();
  const today = new Date();
  const [popup, setPopup] = useState({ open: false, message: "" });
  useEffect(() => {
    if (loc[0] === 0 && loc[1] === 0) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        setLoc([position.coords.latitude, position.coords.longitude]);
      });
    }
  });
  const { data: wheaterData } = useSWR(
    `https://api.api-ninjas.com/v1/weather?lat=${loc[0]}&lon=${loc[1]}`,
    (url) =>
      fetch(url, {
        headers: {
          "X-Api-Key": "rtS094HleN0P2cwTvlNcIw==xM5YifJKjlccXx5e",
        },
      }).then((res) => res.json())
  );
  const { data: picOftheDay } = useSWR(
    `https://api.nasa.gov/planetary/apod?api_key=J7cThsDOGHwjor0P2XawBpLourXSAPNQsoe4akKa`
  );
  const { data: newsData } = useSWR(
    "https://newsapi.org/v2/top-headlines?sources=spiegel-online&apiKey=03071e53dded407f86c6183e7433e8e8"
  );
  console.log(picOftheDay);
  if (!wheaterData && !picOftheDay && !newsData) return <div>Loading...</div>;
  return (
    <div>
      <Popup
        isOpen={popup.open}
        onClick={() => setPopup({ open: false, message: popup.message })}
      >
        <FormattedText>{popup.message}</FormattedText>
      </Popup>
      <div className="header">
        <h2 style={{ marginBottom: "26px" }}>Wetter</h2>
        <div className="elem">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="48"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M18.8061 12.9187C19.1275 12.853 19.4348 12.7487 19.7231 12.6109C21.0698 11.9671 22 10.5922 22 9C22 6.79086 20.2092 5 18 5C16.8153 5 15.7498 5.51635 15.0188 6.33309C14.6505 6.74461 14.6855 7.37681 15.097 7.74513C15.5085 8.11346 16.1407 8.07844 16.5091 7.66691C16.8767 7.25616 17.4078 7.00001 18 7C18.069 7 18.1373 7.0035 18.2045 7.01033C18.4734 7.03764 18.7266 7.11823 18.9533 7.24139C19.5768 7.58007 20 8.24061 20 9C20 9.82843 19.4963 10.5392 18.7785 10.8428C18.5392 10.944 18.2762 11 18.0001 11H18H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H18H18C18.2762 13 18.5458 12.972 18.8061 12.9187ZM5 10H10.5H10.5L10.5162 9.99995C10.5969 9.99944 10.6768 9.99509 10.7556 9.98709C12.0163 9.85908 13 8.79442 13 7.5C13 6.11929 11.8807 5 10.5 5C9.75951 5 9.09317 5.32323 8.63683 5.83309C8.26851 6.24461 8.30353 6.87681 8.71505 7.24513C9.12658 7.61346 9.75878 7.57844 10.1271 7.16691C10.2201 7.06303 10.352 7.00001 10.5 7C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7762 7.99999 10.5 8H10.5H5C4.44772 8 4 8.44772 4 9C4 9.55228 4.44772 10 5 10ZM16.5 14L8 14C7.44771 14 7 14.4477 7 15C7 15.5523 7.44771 16 8 16L16.5 16C16.7762 16 17 16.2239 17 16.5C17 16.7761 16.7761 17 16.5 17C16.352 17 16.2201 16.937 16.1271 16.8331C15.7588 16.4216 15.1266 16.3865 14.7151 16.7549C14.3035 17.1232 14.2685 17.7554 14.6368 18.1669C15.0932 18.6768 15.7595 19 16.5 19C17.8807 19 19 17.8807 19 16.5C19 15.2056 18.0163 14.1409 16.7556 14.0129C16.6768 14.0049 16.5969 14.0006 16.5162 14.0001L16.5 14Z"
              fill="#ffffffbb"
            ></path>
          </svg>
          <p>
            {wheaterData?.wind_speed}
            <span>km/h</span>
          </p>
        </div>
        <div className="elem">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="48"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12.9998C16.213 13.9109 17 15.3631 17 17C17 19.7614 14.7614 22 12 22C9.23858 22 7 19.7614 7 17C7 15.3631 7.78702 13.9109 9 12.9998V5ZM12 4C11.4477 4 11 4.44772 11 5V13.5351C11 13.8921 10.8097 14.222 10.5007 14.4007C9.60141 14.921 9 15.8908 9 17C9 18.6569 10.3431 20 12 20C13.6569 20 15 18.6569 15 17C15 15.8908 14.3986 14.921 13.4993 14.4007C13.1903 14.222 13 13.8921 13 13.5351V5C13 4.44772 12.5523 4 12 4Z"
              fill="#ffffffbb"
            ></path>
          </svg>
          <p>
            {wheaterData?.temp}
            <span>°C</span>
          </p>
        </div>
        <h2 style={{ marginTop: "26px" }}>Nachrichten</h2>
        <div className="alerts" style={{ marginTop: "26px" }}>
          {newsData?.articles.map((warning: any, i: number) => (
            <div
              className="alert"
              key={"al_" + i}
              onClick={() => {
                window.open(warning.url, "_blank");
              }}
              style={{ marginTop: "26px" }}
            >
              <h1>
                {warning.title}
                <br />
                <span>{new Date(warning.publishedAt).toLocaleString()}</span>
              </h1>

              <p>{warning.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="imageMask"></div>
      <img
        src={picOftheDay?.hdurl}
        style={{
          filter: "grayscale(20%)",
        }}
        className="round"
      />
      <p
        className="roundDesc"
        onClick={() =>
          setPopup({
            open: true,
            message:
              picOftheDay.explanation + `\n\n [View full](${picOftheDay.hdurl})`,
          })
        }
      >
        Bild des Tages - {picOftheDay.title}
      </p>
    </div>
  );*/
};

export default Home;
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
