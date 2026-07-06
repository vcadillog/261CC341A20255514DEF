import { Component,inject,OnInit,ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule,FormControl,FormGroup,Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { PersonaRequest } from '../../model/persona-request';
import { PersonaResponse } from '../../model/persona-response';
import { SexoService } from '../../services/sexo.service';
import { Sexo } from '../../model/sexo';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { TipoDocumento } from '../../model/tipo-documento';
import { UbigeoService } from '../../services/ubigeo.service';
import { Ubigeo } from '../../model/ubigeo';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registrar-persona',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './registrar-persona.html',
  styleUrl: './registrar-persona.css',
})
export class RegistrarPersona implements OnInit{
  private personaService=inject(PersonaService)
  private sexoService=inject(SexoService)
  private tipoDocumentoService=inject(TipoDocumentoService)
  private ubigeoService=inject(UbigeoService)
  private authService=inject(AuthService)
  private router=inject(Router)
  private cdr=inject(ChangeDetectorRef)

  personaResponse:PersonaResponse[]=[];
  personaRequest:PersonaRequest={} as PersonaRequest
  personaForm:FormGroup;
  sexo:Sexo[]=[];
  tipoDocumento:TipoDocumento[]=[];
  ubigeo:Ubigeo[]=[];
  isEdited:boolean=false;


  constructor(){
    this.personaForm=new FormGroup({
      idPersona:new FormControl(''),
      apellidoPaterno:new FormControl('',[Validators.required,Validators.minLength(2)]),
      apellidoMaterno:new FormControl('',[Validators.required,Validators.minLength(2)]),
      nombres:new FormControl('',[Validators.required,Validators.minLength(2)]),
      idSexo:new FormControl('I'),
      fechaNacimiento:new FormControl(''),
      idTipoDocumento:new FormControl('1'),
      numDocumento:new FormControl('',[Validators.required,Validators.minLength(8)]),
      telefono:new FormControl('',[Validators.required,Validators.minLength(7)]),
      direccion:new FormControl('',[Validators.required,Validators.minLength(8)]),
      idUbigeo:new FormControl('150101'),
    })
  }

  ngOnInit(): void {
    this.getSexo();
    this.getTipoDocumento();
    this.getUbigeo();
    this.getPersona();
  }

  getPersona():void{
    this.personaService.getPersona().subscribe(
      (result : PersonaResponse[])=>{
        console.log('getPersona',result);
        this.personaResponse=result;
        this.cdr.detectChanges();
      }
    );
  }

  getSexo():void{
    this.sexoService.getSexo().subscribe(
      (result : Sexo[])=>{
        console.log('getSexo',result);
        this.sexo=result;
        this.cdr.detectChanges();
      }
    );
  }

  getTipoDocumento():void{
    this.tipoDocumentoService.getTipoDocumento().subscribe(
      (result : TipoDocumento[])=>{
        console.log('getTipoDocumento',result);
        this.tipoDocumento=result;
        this.cdr.detectChanges();
      }
    );
  }

  getUbigeo():void{
    this.ubigeoService.getUbigeo().subscribe(
      (result : Ubigeo[])=>{
        console.log('getTipoDocumento',result);
        this.ubigeo=result;
        this.cdr.detectChanges();
      }
    );
  }

  registrarPersona(){
    console.log('registrarPersona() called. form value:', this.personaForm.value);
    console.log('form valid?', this.personaForm.valid);
    if(this.personaForm.invalid){
      Object.entries(this.personaForm.controls).forEach(([name, control]) => {
        if(control.invalid){
          console.log(`Campo invalido: ${name}`, control.errors);
        }
      });
      this.personaForm.markAllAsTouched();
      return;
    }

    const formValue = this.personaForm.value;
    this.personaRequest = {
      idPersona: formValue.idPersona ? Number(formValue.idPersona) : (null as any),
      apellidoPaterno: formValue.apellidoPaterno,
      apellidoMaterno: formValue.apellidoMaterno,
      nombres: formValue.nombres,
      idSexo: formValue.idSexo,
      fechaNacimiento: formValue.fechaNacimiento,
      idTipoDocumento: Number(formValue.idTipoDocumento),
      numDocumento: formValue.numDocumento,
      telefono: formValue.telefono,
      direccion: formValue.direccion,
      idUbigeo: formValue.idUbigeo,
    };

    if(this.isEdited){
      this.personaService.actualizarPersona(this.personaRequest).subscribe({
        next: () => {
          this.getPersona();
          this.refreshForm();
        },
        error: (err) => console.error('Error al actualizar persona', err),
      });
    } else {
      this.personaService.registrarPersona(this.personaRequest).subscribe({
        next: () => {
          this.getPersona();
          this.refreshForm();
        },
        error: (err) => console.error('Error al registrar persona', err),
      });
    }
  }

  refreshForm(){
    this.isEdited = false;
    this.personaForm.reset({
      idPersona: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      nombres: '',
      idSexo: 'I',
      fechaNacimiento: '',
      idTipoDocumento: '1',
      numDocumento: '',
      telefono: '',
      direccion: '',
      idUbigeo: '150101',
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

