import { authorizedFetch } from '@/lib/apiClient';




// export async function GetBankAccountType() {
//   return authorizedFetch(`/admin/get-account-type`, {
//     method: 'GET',
//   });
// }


// export async function AddBankAccountType(data) {
//   return authorizedFetch(`/admin/add-account-type`, {
//     body:JSON.stringify(data),
//     method: 'POST',
//   });
// }


// export async function EditBankAccountType(data) {
//   return authorizedFetch(`/admin/edit-account-type`, {
//     body:JSON.stringify(data),
//     method: 'POST',
//   });
// }


// export async function DeleteBankAccountType(id) {
//   return authorizedFetch(`/admin/delete-account-type`, {
//     body:JSON.stringify({id}),
//     method: 'POST',
//   });
// }


export async function ChangeStatusAccountType(id , status) {
  console.log("hiting api" , status)
  return authorizedFetch(`/admin/change-status-account-type`, {
    body:JSON.stringify({id , status}),
    method: 'POST',
  });
}


// //Vehicle Management

// export async function GetAllVehicleData() {
//   return authorizedFetch(`/admin/get-all-vehicle`, {
//     method: 'GET',
//   });
// }



// export async function AddNewVehicle(data) {
//   return authorizedFetch(`/admin/add-vehicle-price`, {
//     body:JSON.stringify(data),
//     method: 'POST',
//   });
// }


// export async function EditVehiclePrice(data) {
//   return authorizedFetch(`/admin/edit-vehicle-price`, {
//     body:JSON.stringify(data),
//     method: 'POST',
//   });
// }

//delete-vehicle-type

// export async function DeleteVehicleType(id) {
//   return authorizedFetch(`/admin/delete-vehicle-type`, {
//     body:JSON.stringify({id}),
//     method: 'POST',
//   });
// }




export async function dashboardState(scope) {
  return authorizedFetch(`/admin/dashboard-state?scope=${scope}`, {
    method: 'GET',
  });
}

// recent-order

export async function RecentOrder(limit) {
  return authorizedFetch(`/admin/recent-order?limit=${limit}`, {
    method: 'GET',
  });
}
// GET CEILING LIST
export async function getCeilingList() {
  return authorizedFetch(`/user/ceiling`, {
    method: "GET",
  });
}

// ADD CEILING IMAGE
export async function addCeilingImage(file,name) {
  const formData = new FormData();
  formData.append("image", file);
   formData.append("name", name);
  formData.append("type", "ceiling");

  return authorizedFetch(`/user/add-ceiling`, {
    
    method: "POST",
    body: formData,
  });
}
// FINISHES
// GET => returns plastic, marble, steel object

export async function getFinishesList() {
  return authorizedFetch(`/user/finishes`, {
    method: "GET",
  });
}

export async function addFinishesImage(image, name, category) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("name", name);
  formData.append("type", category); // "plastic" | "marble" | "steel"

  return authorizedFetch(`/user/add-finishes`, {
    method: "POST",
    body: formData,
  });
}

// HANDRAIL
export async function getHandrailList() {
  return authorizedFetch(`/user/handrail`, {
    method: "GET",
  });
}

export async function addHandrailImage(mainImage, thumbImage, name) {
  const formData = new FormData();
  formData.append("handimage", mainImage);
  formData.append("thumbimage", thumbImage);
  formData.append("name", name);
  formData.append("type", "handrail");

  return authorizedFetch(`/user/add-handrail`, {
    method: "POST",
    body: formData,
  });
}


//  SIZE MANAGEMENT

export async function getCabSizeList() {
  return authorizedFetch(`/user/size`, {
    method: "GET",
  });
}

export async function addCabSize(weight, dim, height, width) {
  return authorizedFetch(`/user/add-size`, {
    method: "POST",
    body: JSON.stringify({
      weight,
      dim,
      height,
      width,
    }),
  });
}

// DELETE SIZE 
export async function deleteCabSize(id) {
  return authorizedFetch(`/user/delete-size`, {  //  endpoint i can chnage it from here  later
    method: "POST",
    body: JSON.stringify({ id }),
  });
}




