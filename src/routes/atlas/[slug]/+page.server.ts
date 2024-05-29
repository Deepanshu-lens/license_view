export const ssr = false;

import { error, type Load } from "@sveltejs/kit";



export const load: Load = async ({ url, locals }) => {
    console.log("getting atlas user data");
    
    try {
      const userData = await locals.pb
        ?.collection("atlas_users")
        .getFullList({
          sort: "-created",
        });
  
      const simpleList = userData.map((item) => ({
        email: item.email,
        created: item.created,
        firstName: item.firstName,
        lastName: item.LastName,
        phone: item.phoneNumber,
        lastModified: item.lastModified,
        unid: item.unid,
        cred: item.cred,

      }));

      const eventData = await locals.pb.collection('atlas_events').getFullList({
        sort: "-created",
      });

      const eventList = eventData.map((item) => ({
        unid:item.unid,
        dbTime:item.dbTime,
        hwTime:item.hwTime,
        evtCode:item.evtCode,
        evtCodeAndSubCode: item.evtCodeAndSubCode,
        evtControllerRef: item.evtControllerRef,
        evtCredRef: item.evtCredRef,
        evtDevRef: item.evtDevRef,
        evtCredHolderRef:item.evtCredHolderRef,
        bgColor: item.bgColor
      }))
  
      return {
        userData: simpleList,
        eventData: eventList
      };
    } catch (err) {
      console.error("Failed to get full list:", err);
      throw error(500, `Failed to load full list ${err}`);
    }
    // }
  };
  