import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenNueva: File;
  public imgShow: any = null;

  constructor(  public modalImagenService: ModalImagenService,
                public fileUploadSerivec: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgShow = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen( file: File){
    this.imagenNueva = file;

    if ( !file){
      return this.imgShow = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgShow = reader.result;
    };

  }

  subirImagen(){

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      customClass: {
        container: 'my-swal'
      },
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.fileUploadSerivec.actualizarFoto(this.imagenNueva, tipo, id).subscribe( (resp: any) => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Foto actualizada',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.modalImagenService.imgActualizada.emit(resp.nombreArchivo);
      this.cerrarModal();
    }, err => {
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo subir la imagen',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });

  }

}
