interface Customer {
  name: string;
  username: string;
  password: string;
  phone_number?: number;
  student_id?: number;
}

interface Barista {
  name: string;
  username: string;
  password: string;
  employee_id: number;
  hours?: number;
  store_id?: number;
}

interface Manager {
  name: string;
  username: string;
  password: string;
  employee_id: number;
  hours?: number;
  store_id?: number;
  salary: number;
}

interface UserAccountInfoProps {
  user: Customer | Manager | Barista;
  type: 'customer' | 'barista' | 'manager';
}

function UserAccountInfo({ user, type }: UserAccountInfoProps) {
  if (type === 'customer') {
    const customer = user as Customer;
    return (
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{customer.name}</td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td>
              {customer.phone_number ? customer.phone_number : 'Not provided'}
            </td>
          </tr>
          {customer.student_id ? (
            <tr>
              <th>Student ID</th>
              <td>{customer.student_id}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    );
  }

  const employee = user as Barista | Manager;

  return (
    <table>
      <tbody>
        <tr>
          <th>Name</th>
          <td>{employee.name}</td>
        </tr>
        <tr>
          <th>Employee ID</th>
          <td>{employee.employee_id}</td>
        </tr>
        <tr>
          <th>Hours</th>
          <td>{employee.hours ?? 0}</td>
        </tr>
        <tr>
          <th>Store ID</th>
          <td>{employee.store_id ? employee.store_id : 'unknown'}</td>
        </tr>
        {type === 'manager' ? (
          <tr>
            <th>Biweekly Salary</th>
            <td>${((employee as Manager).salary / 52).toFixed(2)}</td>
          </tr>
        ) : (
          <tr>
            <th>Calculated Salary</th>
            <td>${((employee.hours ?? 0) * 20).toFixed(2)}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default UserAccountInfo;
