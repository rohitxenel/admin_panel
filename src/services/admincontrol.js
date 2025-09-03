import { authorizedFetch } from '@/lib/apiClient';




export async function GetBankAccountType() {
  return authorizedFetch(`/admin/get-account-type`, {
    method: 'GET',
  });
}


export async function AddBankAccountType(data) {
  return authorizedFetch(`/admin/add-account-type`, {
    body:JSON.stringify(data),
    method: 'POST',
  });
}