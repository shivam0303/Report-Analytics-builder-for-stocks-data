export const setCardData = (data) => {
    return {
        type: 'SET_CARD_DATA',
        payload: data,
    };
};

export const setMetaData = (data) => {
    return {
        type: 'SET_META_DATA',
        payload: data,
    };
};

export const setProfileData = (profileData) => ({
  type: "SET_PROFILE_DATA",
  payload: profileData,
});

