import Swal from 'sweetalert2'

const successMsg = (title)=>{
    const alert = Swal.fire({
        icon: "success",
        title: title,
        confirmButtonColor : "#00b050"
      });
      return
}

export default successMsg