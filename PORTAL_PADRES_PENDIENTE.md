# 🚧 PORTAL PARA PADRES - ACTUALIZACIÓN EN PROGRESO

## ✅ LO QUE YA ESTÁ HECHO (Backend):

1. ✅ Controller actualizado con todos los campos nuevos
2. ✅ Método `uploadDocument` implementado  
3. ✅ Endpoint `/upload-document` agregado
4. ✅ Multer instalado y configurado
5. ✅ Directorio de uploads creado
6. ✅ Ruta estática para servir archivos
7. ✅ Método `submitRegistration` reescrito con TODOS los campos

## ⏳ LO QUE FALTA (Frontend):

El archivo `ParentPortalPage.jsx` necesita expandirse de 4 pasos a 6 pasos con:

### Paso 3: Información Médica
- Obra social
- Número de afiliado
- Grupo sanguíneo
- Alergias
- Medicación habitual
- Observaciones médicas
- Pediatra (nombre y teléfono)
- Estado de vacunación
- Necesidades especiales

### Paso 4: Contacto de Emergencia (ya existe, agregar):
- Teléfono alternativo
- Checkbox: Autorizado para retirar

### Paso 5: Datos del Responsable (ya existe, agregar):
- DNI
- Lugar de trabajo
- Teléfono laboral
- Relación con alumno (select: madre/padre/tutor/otro)

### Paso 6: Autorizaciones y Documentos (NUEVO)
- Checkbox: Autorización fotos/videos
- Checkbox: Autorización salidas educativas  
- Checkbox: Autorización atención médica urgente
- Upload: Foto DNI alumno
- Upload: Foto DNI responsable
- Upload: Certificado de nacimiento
- Upload: Carnet de vacunas
- Upload: Certificado médico
- Upload: Constancia obra social

## 🔧 CÓDIGO PARA COMPLETAR EL FRONTEND

Archivo: `frontend/src/pages/ParentPortalPage.jsx`

### Agregar al Form (después del Paso 2):

```jsx
{/* PASO 3: Información Médica */}
{step === 3 && (
    <>
        <h5 className="mb-4 text-center text-primary">
            <span className="material-icons align-middle me-2">medical_services</span>
            Información Médica
        </h5>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Obra Social *</Form.Label>
                    <Form.Control type="text" name="obraSocial" value={formData.obraSocial} 
                                  onChange={handleChange} required size="lg" />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Número de Afiliado</Form.Label>
                    <Form.Control type="text" name="numeroAfiliado" value={formData.numeroAfiliado} 
                                  onChange={handleChange} size="lg" />
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Grupo Sanguíneo</Form.Label>
                    <Form.Select name="grupoSanguineo" value={formData.grupoSanguineo} 
                                 onChange={handleChange} size="lg">
                        <option value="">Seleccione...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Estado de Vacunación *</Form.Label>
                    <Form.Select name="estadoVacunacion" value={formData.estadoVacunacion} 
                                 onChange={handleChange} required size="lg">
                        <option value="completo">Completo</option>
                        <option value="incompleto">Incompleto</option>
                        <option value="pendiente">Pendiente</option>
                    </Form.Select>
                </Form.Group>
            </Col>
        </Row>
        <Form.Group className="mb-3">
            <Form.Label>Alergias</Form.Label>
            <Form.Control as="textarea" rows={2} name="alergias" value={formData.alergias} 
                          onChange={handleChange} size="lg" 
                          placeholder="Ej: Polen, alimentos, medicamentos..." />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Medicación Habitual</Form.Label>
            <Form.Control as="textarea" rows={2} name="medicacion" value={formData.medicacion} 
                          onChange={handleChange} size="lg" 
                          placeholder="Medicamentos que toma regularmente..." />
        </Form.Group>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Pediatra *</Form.Label>
                    <Form.Control type="text" name="pediatraNombre" value={formData.pediatraNombre} 
                                  onChange={handleChange} required size="lg" 
                                  placeholder="Nombre completo" />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Teléfono Pediatra *</Form.Label>
                    <Form.Control type="tel" name="pediatraTelefono" value={formData.pediatraTelefono} 
                                  onChange={handleChange} required size="lg" />
                </Form.Group>
            </Col>
        </Row>
        <Form.Group className="mb-3">
            <Form.Label>Necesidades Especiales</Form.Label>
            <Form.Control as="textarea" rows={2} name="necesidadesEspeciales" 
                          value={formData.necesidadesEspeciales} onChange={handleChange} size="lg" 
                          placeholder="Cualquier necesidad especial que debamos saber..." />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Observaciones Médicas Adicionales</Form.Label>
            <Form.Control as="textarea" rows={3} name="observacionesMedicas" 
                          value={formData.observacionesMedicas} onChange={handleChange} size="lg" />
        </Form.Group>
    </>
)}

{/* PASO 4: Contacto de Emergencia (actualizado) */}
{step === 4 && (
    <>
        <h5 className="mb-4 text-center text-primary">
            <span className="material-icons align-middle me-2">emergency</span>
            Contacto de Emergencia
        </h5>
        <Alert variant="info" className="mb-4">
            <strong>Importante:</strong> Esta persona será contactada en caso de emergencia si no podemos ubicar a los responsables principales.
        </Alert>
        <Form.Group className="mb-3">
            <Form.Label>Nombre Completo *</Form.Label>
            <Form.Control type="text" name="nombreEmergencia" value={formData.nombreEmergencia} 
                          onChange={handleChange} required size="lg" />
        </Form.Group>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Relación *</Form.Label>
                    <Form.Control type="text" name="relacionEmergencia" value={formData.relacionEmergencia} 
                                  onChange={handleChange} placeholder="Ej: Abuela, Tío, Vecino" 
                                  required size="lg" />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Teléfono Principal *</Form.Label>
                    <Form.Control type="tel" name="telefonoEmergencia" value={formData.telefonoEmergencia} 
                                  onChange={handleChange} required size="lg" />
                </Form.Group>
            </Col>
        </Row>
        <Form.Group className="mb-3">
            <Form.Label>Teléfono Alternativo</Form.Label>
            <Form.Control type="tel" name="telefonoAlternativoEmergencia" 
                          value={formData.telefonoAlternativoEmergencia} 
                          onChange={handleChange} size="lg" />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Check type="checkbox" name="autorizadoRetiroEmergencia" 
                        checked={formData.autorizadoRetiroEmergencia} 
                        onChange={handleChange} 
                        label="Está autorizado/a para retirar al alumno en caso de emergencia" />
        </Form.Group>
    </>
)}

{/* PASO 5: Datos del Responsable (actualizado) */}
{step === 5 && (
    <>
        <h5 className="mb-4 text-center text-primary">
            <span className="material-icons align-middle me-2">person</span>
            Datos del Responsable
        </h5>
        <Form.Group className="mb-3">
            <Form.Label>Relación con el Alumno *</Form.Label>
            <Form.Select name="relacionConAlumno" value={formData.relacionConAlumno} 
                         onChange={handleChange} required size="lg">
                <option value="madre">Madre</option>
                <option value="padre">Padre</option>
                <option value="tutor">Tutor/a Legal</option>
                <option value="abuelo">Abuelo</option>
                <option value="abuela">Abuela</option>
                <option value="tio">Tío</option>
                <option value="tia">Tía</option>
                <option value="otro">Otro</option>
            </Form.Select>
        </Form.Group>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control type="text" name="nombrePadre" value={formData.nombrePadre} 
                                  onChange={handleChange} required size="lg" />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Segundo Nombre</Form.Label>
                    <Form.Control type="text" name="segundoNombrePadre" value={formData.segundoNombrePadre} 
                                  onChange={handleChange} size="lg" />
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Apellido Paterno *</Form.Label>
                    <Form.Control type="text" name="apellidoPaternoPadre" value={formData.apellidoPaternoPadre} 
                                  onChange={handleChange} required size="lg" />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Apellido Materno</Form.Label>
                    <Form.Control type="text" name="apellidoMaternoPadre" value={formData.apellidoMaternoPadre} 
                                  onChange={handleChange} size="lg" />
                </Form.Group>
            </Col>
        </Row>
        <Form.Group className="mb-3">
            <Form.Label>DNI *</Form.Label>
            <Form.Control type="text" name="dniPadre" value={formData.dniPadre} 
                          onChange={handleChange} required size="lg" placeholder="Sin puntos" />
        </Form.Group>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Teléfono Celular *</Form.Label>
                    <Form.Control type="tel" name="telefonoPadre" value={formData.telefonoPadre} 
                                  onChange={handleChange} required size="lg" />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="emailPadre" value={formData.emailPadre} 
                                  onChange={handleChange} size="lg" />
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Lugar de Trabajo</Form.Label>
                    <Form.Control type="text" name="lugarTrabajo" value={formData.lugarTrabajo} 
                                  onChange={handleChange} size="lg" />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Teléfono Laboral</Form.Label>
                    <Form.Control type="tel" name="telefonoTrabajo" value={formData.telefonoTrabajo} 
                                  onChange={handleChange} size="lg" />
                </Form.Group>
            </Col>
        </Row>
        <Form.Group className="mb-3">
            <Form.Check type="checkbox" name="autorizadoRetiro" checked={formData.autorizadoRetiro} 
                        onChange={handleChange} label="Autorizado para retirar al alumno" />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Check type="checkbox" name="autorizadoCambio" checked={formData.autorizadoCambio} 
                        onChange={handleChange} label="Autorizado para autorizar cambios de pañal" />
        </Form.Group>
    </>
)}

{/* PASO 6: Autorizaciones y Documentos (NUEVO) */}
{step === 6 && (
    <>
        <h5 className="mb-4 text-center text-primary">
            <span className="material-icons align-middle me-2">verified_user</span>
            Autorizaciones y Documentos
        </h5>
        
        <Alert variant="warning" className="mb-4">
            <strong>Autorizaciones Requeridas:</strong> Por favor lea cada autorización cuidadosamente antes de aceptar.
        </Alert>
        
        <Card className="mb-4">
            <Card.Header className="bg-light">
                <strong>Autorizaciones</strong>
            </Card.Header>
            <Card.Body>
                <Form.Group className="mb-3">
                    <Form.Check 
                        type="checkbox" 
                        name="autorizacionFotos" 
                        checked={formData.autorizacionFotos} 
                        onChange={handleChange}
                        label={
                            <span>
                                <strong>Autorización de Fotos y Videos:</strong> Autorizo al jardín a tomar fotografías y videos de mi hijo/a para uso interno (cartelera, redes sociales del jardín, registros pedagógicos).
                            </span>
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check 
                        type="checkbox" 
                        name="autorizacionSalidas" 
                        checked={formData.autorizacionSalidas} 
                        onChange={handleChange}
                        label={
                            <span>
                                <strong>Autorización de Salidas Educativas:</strong> Autorizo a mi hijo/a a participar en salidas educativas organizadas por el jardín, acompañado/a por docentes.
                            </span>
                        }
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check 
                        type="checkbox" 
                        name="autorizacionAtencionMedica" 
                        checked={formData.autorizacionAtencionMedica} 
                        onChange={handleChange}
                        label={
                            <span>
                                <strong>Autorización de Atención Médica Urgente:</strong> Autorizo al jardín a solicitar atención médica de urgencia para mi hijo/a en caso de que no puedan contactarme.
                            </span>
                        }
                    />
                </Form.Group>
            </Card.Body>
        </Card>

        <Card className="mb-4">
            <Card.Header className="bg-light">
                <strong>Documentos</strong>
                <small className="text-muted ms-2">(Formatos: JPG, PNG, PDF. Máx 5MB)</small>
            </Card.Header>
            <Card.Body>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <span className="material-icons align-middle me-2 text-danger">badge</span>
                        DNI del Alumno (frente y dorso) *
                    </Form.Label>
                    <Form.Control 
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange('dniAlumno', e)}
                        size="lg"
                    />
                    {documents.dniAlumno && (
                        <small className="text-success">✓ {documents.dniAlumno.name}</small>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        <span className="material-icons align-middle me-2 text-danger">badge</span>
                        DNI del Responsable (frente y dorso) *
                    </Form.Label>
                    <Form.Control 
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange('dniResponsable', e)}
                        size="lg"
                    />
                    {documents.dniResponsable && (
                        <small className="text-success">✓ {documents.dniResponsable.name}</small>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        <span className="material-icons align-middle me-2">description</span>
                        Certificado de Nacimiento *
                    </Form.Label>
                    <Form.Control 
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange('certificadoNacimiento', e)}
                        size="lg"
                    />
                    {documents.certificadoNacimiento && (
                        <small className="text-success">✓ {documents.certificadoNacimiento.name}</small>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        <span className="material-icons align-middle me-2">vaccines</span>
                        Carnet de Vacunas *
                    </Form.Label>
                    <Form.Control 
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange('carnetVacunas', e)}
                        size="lg"
                    />
                    {documents.carnetVacunas && (
                        <small className="text-success">✓ {documents.carnetVacunas.name}</small>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        <span className="material-icons align-middle me-2">local_hospital</span>
                        Certificado Médico
                    </Form.Label>
                    <Form.Control 
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange('certificadoMedico', e)}
                        size="lg"
                    />
                    {documents.certificadoMedico && (
                        <small className="text-success">✓ {documents.certificadoMedico.name}</small>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        <span className="material-icons align-middle me-2">health_and_safety</span>
                        Constancia de Obra Social
                    </Form.Label>
                    <Form.Control 
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange('constanciaObraSocial', e)}
                        size="lg"
                    />
                    {documents.constanciaObraSocial && (
                        <small className="text-success">✓ {documents.constanciaObraSocial.name}</small>
                    )}
                </Form.Group>
            </Card.Body>
        </Card>

        <Alert variant="info">
            <strong>Importante:</strong> Los documentos marcados con * son obligatorios. 
            Los archivos deben estar en formato JPG, PNG o PDF y no superar los 5MB.
        </Alert>
    </>
)}

{/* Botones de navegación */}
<div className="d-flex justify-content-between mt-4">
    <Button variant="secondary" onClick={handleBack} disabled={step === 1 || saving} size="lg">
        <span className="material-icons align-middle me-2">arrow_back</span>
        Anterior
    </Button>
    <Button variant="primary" onClick={handleNext} disabled={saving} size="lg">
        {saving ? (
            <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {step === 6 ? 'Enviando...' : 'Guardando...'}
            </>
        ) : (
            <>
                {step === 6 ? (
                    <>
                        <span className="material-icons align-middle me-2">send</span>
                        Enviar
                    </>
                ) : (
                    <>
                        Siguiente
                        <span className="material-icons align-middle ms-2">arrow_forward</span>
                    </>
                )}
            </>
        )}
    </Button>
</div>
```

## 🎯 INSTRUCCIONES FINALES:

1. **Reemplazar** el contenido del `step === 3` en adelante con el código de arriba
2. **Mantener** los pasos 1 y 2 tal como están
3. **Agregar** los imports de `Row` y `Col` de Bootstrap al inicio si no están
4. **Reiniciar** el backend para aplicar cambios

## ✅ LUEGO DE COMPLETAR:

```bash
# Reiniciar backend
cd backend
pkill -9 -f "node.*server"
node server.js

# El frontend se actualiza automáticamente con Vite
```

## 📝 NOTAS:

- El backend YA ESTÁ LISTO para recibir todos estos campos
- Los documentos se suben primero y luego se vinculan al alumno
- Todos los campos se guardan en las tablas correctas
- El sistema crea las relaciones automáticamente

---

**Estado:** Backend 100% | Frontend 60% | Falta agregar los pasos 3-6 al Form
