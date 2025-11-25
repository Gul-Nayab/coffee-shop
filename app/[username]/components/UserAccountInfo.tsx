//SJSU CMPE 138 FALL 2025 TEAM 2
import '@/app/styles/UserAccountInfo.css';

interface Customer {
  name: string;
  username: string;
  password: string;
  phone_number?: number;
}
interface Student {
  name: string;
  username: string;
  password: string;
  phone_number?: number;
  student_id: number;
}

interface Employee {
  name: string;
  username: string;
  password: string;
  e_id: number;
  hours: number;
  store_id: number;
  salary: number;
  is_manager: boolean;
}

interface UserAccountInfoProps {
  user: Customer | Employee | Student;
  type: 'customer' | 'barista' | 'manager' | 'student';
}

function UserAccountInfo({ user, type }: UserAccountInfoProps) {
  function formatPhone(num?: number) {
    if (!num) return "Not provided";

    const str = num.toString();

    if (str.length !== 10) return str;

    const area = str.slice(0, 3);
    const mid = str.slice(3, 6);
    const last = str.slice(6);

    return `(${area}) ${mid} ${last}`;
  }
  
  if (type === 'customer' || type === 'student') {
    const customer = user as Customer | Student;
    return (
      <table>
        <tbody>
          <tr>
            <th>Name:</th>
            <td>{customer.name}</td>
          </tr>
          <tr>
            <th>Phone Number:</th>
            <td>
              {formatPhone(customer.phone_number)}
            </td>
          </tr>
          {type == 'student' ? (
            <tr>
              <th>Student ID:</th>
              <td>{(customer as Student).student_id}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    );
  }

  const employee = user as Employee;

  return (
    <table>
      <tbody>
        <tr>
          <th>Name</th>
          <td>{employee.name}</td>
        </tr>
        <tr>
          <th>Employee ID</th>
          <td>{employee.e_id}</td>
        </tr>
        <tr>
          <th>Hours</th>
          <td>{employee.hours ?? 0}</td>
        </tr>
        <tr>
          {type === 'manager' ? <th>Managed Cafe</th> : <th>Works for Cafe</th>}
          <td>Cafe #{employee.store_id}</td>
        </tr>
        {type === 'manager' ? (
          <tr>
            <th>Biweekly Salary</th>
            <td>${employee.salary}</td>
          </tr>
        ) : (
          <tr>
            <th>Calculated Salary</th>
            <td>${((employee.hours ?? 0) * employee.salary).toFixed(2)}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default UserAccountInfo;
