import Layout from "../layouts/Main";
import CardProfile from "../components/card-profile";
import Header from "components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "components/footer";
import { trackingAnalytics } from "utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "store";

const Profile = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [value, setValue] = useState(0)
  const [showLogin, setShowLogin] = useState(false);
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken === null) {
      router.push("/");
    }else{
      trackingAnalytics(`page_view_profile`, user?.first_name, user?.email);
    }
  }, []);
  useEffect(() => {
    if(router?.query?.header){
      if(router?.query?.header != undefined){
        setValue(Number(router?.query?.header))
      }
    }
  }, [])

  return (
    <Layout>
     <Header showLogin={showLogin}/>
      {/* <div className='flex-row flex-1 align-left'> */}
      <CardProfile values={value} />
      {/* </div> */}
      <div style={{backgroundColor: 'white'}}>
      <Footer showLogin={() => setShowLogin(true)}/>
      </div>
     
    </Layout>
  );
};

export default Profile;
